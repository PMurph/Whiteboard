define([
    'marionette',
    'underscore',
    'vent'
], function(
    Marionette,
    _,
    vent) {
    'use strict';

    var drawMessage = {
        vertices: [],
        tool: {
            type: 'line',
            size: 10,
            colour: 'black'
        }
    };

    var msg = {"vertices":[{"x":145,"y":102},{"x":158,"y":101},{"x":178,"y":101},{"x":195,"y":103},{"x":201,"y":118},{"x":195,"y":154},{"x":164,"y":191},{"x":139,"y":214},{"x":130,"y":224},{"x":123,"y":237},{"x":123,"y":249},{"x":128,"y":256},{"x":131,"y":259},{"x":139,"y":255},{"x":160,"y":233},{"x":180,"y":212},{"x":203,"y":198},{"x":229,"y":196},{"x":249,"y":198},{"x":261,"y":209},{"x":269,"y":229},{"x":278,"y":245},{"x":286,"y":254},{"x":295,"y":256},{"x":304,"y":254},{"x":311,"y":244},{"x":316,"y":222},{"x":320,"y":198},{"x":328,"y":183},{"x":338,"y":180},{"x":344,"y":180},{"x":352,"y":206},{"x":361,"y":252},{"x":369,"y":279},{"x":380,"y":285},{"x":390,"y":284},{"x":394,"y":276},{"x":396,"y":270},{"x":393,"y":269},{"x":355,"y":281},{"x":311,"y":293},{"x":273,"y":304},{"x":204,"y":328},{"x":138,"y":346},{"x":83,"y":358},{"x":43,"y":362},{"x":7,"y":359},{"x":0,"y":339},{"x":0,"y":303},{"x":12,"y":250},{"x":56,"y":219},{"x":128,"y":212},{"x":187,"y":219},{"x":219,"y":232},{"x":242,"y":241},{"x":254,"y":248},{"x":263,"y":252},{"x":266,"y":253},{"x":271,"y":254},{"x":278,"y":252},{"x":284,"y":247},{"x":289,"y":239},{"x":292,"y":223},{"x":294,"y":200},{"x":294,"y":183},{"x":291,"y":174},{"x":291,"y":171},{"x":291,"y":172},{"x":291,"y":172}],"tool":{"type":"polyline","size":10,"colour":"black"}};

    return Marionette.ItemView.extend({
        template: _.template('<canvas></canvas>'),

        attributes: {
            id: 'paint'
        },

        ui: {
            canvas: 'canvas'
        },

        events: {
            mousedown: '_mouseDown',
            mouseup: '_mouseUp'
        },

        initialize: function(options) {
            this.roomModel = options.roomModel;
        },

        onShow: function() {
            this._canvasElement = this.ui.canvas[0];
            this._ctx = this._canvasElement.getContext('2d');

            this._canvasElement.width = 700;
            this._canvasElement.height = 500;

            this._ctx.lineWidth = 10;
            this._ctx.lineJoin = 'round';
            this._ctx.lineCap = 'round';
            this._ctx.strokeStyle = 'black';

            this.drawFromMessage(msg);
        },

        onBeforeDestroy: function() {
            this.ui.canvas.off();
        },

        _mouse: { x: 0, y: 0 },

        _lastMove: 0, // Time between mousemove events

        _mouseDown: function(e) {
            var self = this;

            this._ctx.beginPath();
            this._updateMouse(e);
            drawMessage.vertices = [];

            this.ui.canvas.on('mousemove', function(e) {
                var now = new Date();
                if (now - self._lastMove > 25) {
                    self._updateMouse(e);
                    self._lastMove = now;
                    self._paint();
                }
            });
        },

        _mouseUp: function(e) {
            this._updateMouse(e);
            this._paint();
            this.ui.canvas.off('mousemove');
            vent.trigger('draw', {
                roomID: this.roomModel.get('id'),
                message: drawMessage
            });
        },

        _updateMouse: function(e) {
            this._mouse.x = e.pageX - this._canvasElement.offsetLeft;
            this._mouse.y = e.pageY - this._canvasElement.offsetTop;
            drawMessage.vertices.push({ x: this._mouse.x, y: this._mouse.y });
        },

        _paint: function() {
            this._ctx.lineTo(this._mouse.x, this._mouse.y);
            this._ctx.stroke();
        },

        drawFromMessage: function(drawMessage) {
            var self = this;
            this._ctx.beginPath();

            _.each(drawMessage.vertices, function(vertex) {
                self._ctx.lineTo(vertex.x, vertex.y);
                self._ctx.stroke();
            });
        }
    });
});
