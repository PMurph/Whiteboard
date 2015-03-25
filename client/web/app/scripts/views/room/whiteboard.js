define([
    'marionette',
    'underscore',

    'vent',

    'tpl!templates/room/whiteboard.html'
], function(
    Marionette,
    _,

    vent,

    WhiteboardTemplate
) {
    'use strict';

    return Marionette.ItemView.extend({
        template: WhiteboardTemplate,

        attributes: {
            id: 'paint'
        },

        ui: {
            spinner: '#spinnerBox',
            canvas: '#mainCanvas'
        },

        events: {
            mousedown: '_mouseDown',
            mouseup: '_mouseUp',
            mouseleave: '_mouseUp'
        },

        initialize: function(options) {
            this.roomModel = options.roomModel;
            this.drawTool = options.drawTool;
        },

        onShow: function() {
            this._canvasElement = this.ui.canvas[0];
            this._ctx = this._canvasElement.getContext('2d');

            this._canvasElement.width = 700;
            this._canvasElement.height = 500;

            this._ctx.lineWidth = 10;
            this._ctx.lineJoin = 'round';
            this._ctx.lineCap = 'round';
            this._ctx.strokeStyle = '#000000';
        },

        onBeforeDestroy: function() {
            this.ui.canvas.off();
        },

        _mouse: { x: 0, y: 0 },

        _lastMove: 0, // Time between mousemove events

        _currentDrawMessage: null,

        _mouseDown: function(e) {
            var self = this;
            var drawModel = this.drawTool.getDrawModel();

            this._currentDrawMessage = drawModel;
            this._ctx.lineWidth = drawModel.getThickness();
            this._ctx.beginPath();
            this._updateMouse(e);
            this._ctx.strokeStyle = drawModel.getColour();

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
            var drawMessage = this._currentDrawMessage;

            if (!drawMessage) {
                return;
            }
            this._updateMouse(e);
            this._paint();
            this.ui.canvas.off('mousemove');

            this._currentDrawMessage = null;
            this._ctx.closePath();

            vent.trigger('draw', {
                roomID: this.roomModel.get('id'),
                message: drawMessage.toJSON()
            });
        },

        _updateMouse: function(e) {
            this._mouse.x = e.pageX - this._canvasElement.offsetLeft;
            this._mouse.y = e.pageY - this._canvasElement.offsetTop;
            this._currentDrawMessage.addCoordinate(this._mouse.x, this._mouse.y);
        },

        _paint: function() {
            this._ctx.lineTo(this._mouse.x, this._mouse.y);
            this._ctx.stroke();
        },

        drawFromMessage: function(drawMessage) {
            var self = this;
            var oldStrokeStyle = this._ctx.strokeStyle;
            var oldLineWidth = this._ctx.lineWidth;

            this._ctx.strokeStyle = drawMessage.tool.colour;
            this._ctx.lineWidth = drawMessage.tool.thickness;

            this._ctx.beginPath();
            _.each(drawMessage.vertices, function(vertex) {
                self._ctx.lineTo(vertex.x, vertex.y);
                self._ctx.stroke();
            });
            this._ctx.closePath();

            this._ctx.strokeStyle = oldStrokeStyle;
            this._ctx.lineWidth = oldLineWidth;
        },

        drawFromGetAllMessages: function(drawMessages) {
            _.each(drawMessages, function(drawMessage) {
                this.drawFromMessage(drawMessage.message);
            }, this);

            this.ui.spinner.hide();
        }
    });
});
