var ZeldaMap = {};
ZeldaMap.positions = [
  [0.5,0.5],
];

ZeldaMap.init = function() {
    var self = this;
    var viewer = OpenSeadragon({
        id:              "mapZelda",
        prefixUrl:     "libs/openseadragon/images/",
        maxZoomPixelRatio: 6.0,
        tileSources:   [
            "images/Zelda_BotW_map.dzi"
        ]
    });
    var overlay = viewer.svgOverlay();
    ZeldaMap.viewer=viewer;
    ZeldaMap.overlay=overlay;

    var zoomEl = document.querySelectorAll('#zoom')[0];

    var clickMap= function(e) {
      console.log('map', e);
      var webPoint = e.position;
      var viewportPoint = viewer.viewport.pointFromPixel(webPoint);
      var imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);
      //var zoom = viewer.viewport.getZoom(true);
      //var imageZoom = viewer.viewport.viewportToImageZoom(zoom);
      var positionEl = document.querySelectorAll('#position')[0];
      var str= 'Web:<br>' + webPoint.toString() + 
          '<br><br>Viewport:<br>' + viewportPoint.toString() +
          '<br><br>Image:<br>' + imagePoint.toString();

      positionEl.innerHTML = str;
    var overlay = ZeldaMap.overlay;
    var d3Rect = d3.select(overlay.node()).append("circle")
        .style('fill', '#f00')
        .attr("cx", viewportPoint.x)
        .attr("cy", viewportPoint.y)
        .attr("r", 0.001);
    overlay.onClick(d3Rect.node(), clickIcon);
      if(e.quick){
      }
    }
    var clickIcon = function(e) {
        //console.log('click', arguments);
        var webPoint = e.position;
        var viewportPoint = viewer.viewport.pointFromPixel(webPoint);
        var imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);
        console.log('icon', e);

        var positionEl = document.querySelectorAll('#click')[0];
        positionEl.innerHTML = 'Web:<br>' + webPoint.toString() + 
            '<br><br>Viewport:<br>' + viewportPoint.toString() +
            '<br><br>Image:<br>' + imagePoint.toString();

    };
    // for svg overlay
    var overlay = viewer.svgOverlay();
    var d3Rect = d3.select(overlay.node()).append("circle")
        .style('fill', '#f00')
        .attr("cx", 0.5)
        .attr("cy", 0.5)
        .attr("r", 0.001);
    overlay.onClick(d3Rect.node(), clickIcon);
    $(window).resize(function() {
        overlay.resize();
    });

    // for mouse tracking
    var count=0;

    var updateZoom = function() {
        var zoom = viewer.viewport.getZoom(true);
        var imageZoom = viewer.viewport.viewportToImageZoom(zoom);
        var str = 'Zoom:<br>' + (Math.round(zoom * 100) / 100) + 
            '<br><br>Image Zoom:<br>' + (Math.round(imageZoom * 100) / 100) +
            '<br>';

        zoomEl.innerHTML = str;   
    }
    var onOpen = function() {
      /*
      var tracker = new OpenSeadragon.MouseTracker({
          element: viewer.container,
      });  
      tracker.setTracking(true);  
      console.log(tracker);
      */
      //viewer.innerTracker.clickHandler=onClickH;
      viewer.addHandler('animation', updateZoom);
      viewer.addHandler('canvas-double-click',clickMap);
    }
    viewer.addHandler('open',onOpen);
    viewer.gestureSettingsMouse.clickToZoom=false;
    viewer.gestureSettingsPen.clickToZoom=false;
    viewer.gestureSettingsTouch.clickToZoom=false;
    viewer.gestureSettingsUnknown.clickToZoom=false;
}
