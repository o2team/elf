(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory)
    } else if (typeof module === 'object' && module.exports) {
        // CMD
        module.exports = factory()
    } else {
        // Browser globals (root is window)
        root.Orientation = factory()
    }
}(this, function () {
    var assign = Object.assign || function (base, extend) {
        for (var prop in extend) {
            base[prop] = extend[prop]
        }
        return base
    }

    var Preloader = function (options) {
        this.opts = assign({
            resources: [],
            perMinTime: 0,
            attr: 'preload',
            onProgress: function () {},
            onCompletion: function () {}
        }, options)

        var preloads = document.querySelectorAll('[' + this.opts.attr + ']')
        for (var i = 0; i < preloads.length; i++) {
            var preload = preloads[i]
            if (preload.src) this.opts.resources.push(preload.src)
        }

        this.length = this.opts.resources.length
        this.loaded = 0
        this.done = function (resource, element) {
            this.loaded += 1

            this.onProgress && this.onProgress(this.loaded, this.length)
            if (this.loaded >= this.length) {
                this.onCompletion && this.onCompletion()
            }
        }
    }

    Preloader.prototype.addProgressListener = function (fn) {
        this.onProgress = fn
    }

    Preloader.prototype.addCompletionListener = function (fn) {
        this.onCompletion = fn
    }

    Preloader.prototype.start = function () {
        var self = this
        for (var i = 0; i < self.length; i++) {
            var resource = self.opts.resources[i]
            var image = new Image()
            var startTime = new Date()
            image.onload = image.onerror = function () {
                var duration = new Date() - startTime
                var diff = self.opts.perMinTime - duration

                diff > 0 ? setTimeout(function () {
                    self.done(resource, image)
                }, diff) : self.done(resource, image)
            }
            image.src = resource
        }

        if (!self.length) self.done(null, null)
    }

    return Preloader
}))
