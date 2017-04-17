#!ruby 
require 'fileutils'
require 'seadragon'

slicer = Seadragon::Slicer.new({
  source_path: './Zelda_BotW_Korok_Place name.png', 
  tiles_path: '../docs/images/', 
  handle: 'Zelda_BotW_map',
  format: 'png',
})

slicer.slice!
slicer.write_dzi_specification
