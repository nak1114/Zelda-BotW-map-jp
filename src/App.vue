<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <q-layout>

      <!-- Top Menu Bar-->
      <div slot="header" class="toolbar">
        <button class="hide-on-drawer-visible" @click="$refs.leftDrawer.open()">
          <i>menu</i>
        </button>
        <q-toolbar-title :padding="0">
          ゼルダの伝説BotW　マップ v{{$q.version}}
        </q-toolbar-title>
      </div>

      <!-- Side Menu -->
      <q-drawer ref="leftDrawer">
        <div class="toolbar light">
          <q-toolbar-title :padding="1">
            アイコン
          </q-toolbar-title>
        </div>
        <div class="list">
          <label class="item" v-for="(item, index) in items">
            <div class="item-content has-secondary">
              {{item[0]}}
            </div>
            <div class="item-secondary">
              <q-toggle v-model="item[1]"></q-toggle>
            </div>
          </label>
        </div>
        <div class="list no-border platform-delimiter">
          <q-drawer-link icon="view_quilt" to="/" exact>
            About Layout
          </q-drawer-link>
        </div>
      </q-drawer>
      <!--
        Replace following "div" with
        "<router-view class="layout-view">" component
        if using subRoutes
            <div class="logo-container non-selectable no-pointer-events">
              <div class="logo">
                <img src="~assets/quasar-logo.png">
                <p class="caption text-center">
                  <span class="desktop-only">Move your mouse3.</span>
                  <span class="touch-only">Touch screen and move.</span>
                </p>
              </div>
            </div>
          <div id="toolbarDiv" style='overflow:auto;'>
            <span style='float:right;margin:10px 20px 0 0'>
              | <a id="korok-hide" href="#korok-hide">消去</a>
              | <a id="zoom-in" href="#zoom-in">拡大</a>
              | <a id="zoom-out" href="#zoom-out">縮小</a>
              | <a id="home" href="#home">全体</a>
              | <a id="full-page" href="#full-page">全画面</a>
            </span>
            <span style='float:left;margin:10px 0 0 20px'>
              &lt;&nbsp;
              <a id="previous" href="#previous-page">Previous</a>
              | <a id="next" href="#next-page">Next</a>
              &nbsp;&gt;
              <span id='currentpage'> 1 of 3 </span>
            </span>
            <span></span>
          </div>

        <div>
          <my-top3></my-top3>
        </div>
        <div>
          <router-view></router-view>
        </div>
      -->

      <!-- Main -->
      <div class="layout-view">
        <div class="map">
          <div class="mapbg" id="mapZelda"></div>
          <div class="info">
            <div id="position">
            </div>
            <div id="zoom">
            </div>
            <div id="click">
            </div>
          </div>
        </div>
        <div>
          <router-view></router-view>
        </div>
      </div>
    </q-layout>
  </div>
</template>

<script>
/*
 * Root component
 */
// import OpenSeadragon from 'OpenSeadragon'
import OpenSeadragon, {Point} from 'openseadragon'
import 'svg-overlay'
import * as d3 from 'd3'

var cclick = function (e, idx, nodes) {
  console.log('click', e, idx, nodes, this)
  return false
}

export default {
  data () {
    return {
      items: [
        ['コログの実', true],
        ['祠・塔', false],
        ['メインチャレンジ', true],
        ['サブチャレンジ', true],
        ['祠チャレンジ', true],
        ['写し絵', true],
        ['地名', true],
        ['敵種族', true],
        ['宝箱', true],
        ['プライベート', true]
      ],
      Zeldamap: {
      }
    }
  },
  components: {
    'my-top3': require('components/Index')
  },
  mounted () {
    var self = this
    var viewer = OpenSeadragon({
      id: 'mapZelda',
      prefixUrl: 'statics/libs/openseadragon/images/',
      // toolbar: 'toolbarDiv',
      // zoomInButton: 'zoom-in',
      // zoomOutButton: 'zoom-out',
      // homeButton: 'home',
      // fullPageButton: 'full-page',
      // nextButton: 'next',
      // previousButton: 'previous',
      maxZoomPixelRatio: 6.0,
      tileSources: [
        'statics/images/Zelda_BotW_map.dzi'
      ]
    })
    var overlay = viewer.svgOverlay()
    this.Zeldamap.viewer = viewer
    this.Zeldamap.overlay = overlay
    this.Zeldamap.origin = new Point(3896.0, 5880.0)
    window.addEventListener('resize', function () { overlay.resize() })

    // var typedata2=["korok","main_quest","sub_quest","shrink_quest","shrink","tower","photo","private"]
    var typedata = ['mapicon', 'mapsub']
    var icondata = ['korok']
    d3.select(overlay.node()).selectAll('g').data(typedata).enter().append('g')
    .attr('id', function (d) { return d })
    d3.select(overlay.node().parentNode).append('defs').selectAll('pattern').data(icondata).enter().append('pattern')
      .attr('id', function (d) { return 'icon_' + d })
      .attr('x', '0%')
      .attr('y', '0%')
      .attr('height', '100%')
      .attr('width', '100%')
      .attr('viewBox', '0 0 512 512')
      .append('image')
      .attr('x', '0%')
      .attr('y', '0%')
      .attr('height', '512')
      .attr('width', '512')
      .attr('xlink:href', function (d) { return 'statics/images/icon_' + d + '.png' })
    var jsondata = [
      {
        type: 'korok',
        lat: 10,
        lng: 10,
        comment: 'hoge',
        roots: [
          {
            lat: -10,
            lng: -10,
            comment: '01.切り株'
          },
          {
            lat: -20,
            lng: -10,
            comment: '02.ゴール'
          }
        ]
      },
      {
        type: 'korok',
        lat: -10,
        lng: 10,
        comment: 'hogefg'
      }

    ]
    viewer.addHandler('animation', self.updateZoom)

    viewer.addHandler('open', function () {
      var vp2 = viewer.viewport.imageToViewportCoordinates(self.Zeldamap.origin)
      viewer.viewport.zoomTo(16)
      viewer.viewport.panTo(vp2)

      jsondata.forEach(function (d, i) {
        d.id = i
        d.vp = viewer.viewport.imageToViewportCoordinates(d.lat + self.Zeldamap.origin.x, d.lng + self.Zeldamap.origin.y)
      })
      var hoge = d3.select('#mapicon').selectAll('circle').data(jsondata).enter().append('circle')
          .attr('cx', function (d) { return d.vp.x })
          .attr('cy', function (d) { return d.vp.y })
          .attr('r', 0.0001)
          .attr('class', function (d) { return 'map_' + d.type })
          .on('click', cclick)
      self.Zeldamap.icons = hoge
    })
  },
  methods: {
    updateZoom: function (e) {
      var i = this.Zeldamap.icons
      if (i) {
        var zoom = this.Zeldamap.viewer.viewport.getZoom(true)
        i.attr('r', 0.02 / zoom)
      }
    },
    map () {
      return 1
    }
  }
}
</script>

<style>
.map {
  position: relative;
  width: 100%;
  height: 95vh;
  margin: 0 auto;
}

.map .mapbg {
  width: 100%;
  height: 100%;
}

.map .info {
  position: absolute;
  top: 30px;
  left: 0px;
  width: 20%;
  min-height: 0px;
  pointer-events: none;
  background-color: rgba(255, 255, 255, 0.2);
}

.maphide_korok .map_korok {
  display: none;
}

.map_korok {
  fill: url(#icon_korok);
}

.map_korok .map_fill {
  fill: #f00;
  stroke: #0f0;
  stroke-width: 0.0001;
}
</style>
