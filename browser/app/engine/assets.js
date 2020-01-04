/* eslint-disable */
/* This file is generated with "npm run assets", do not edit by hand. */
import descriptors from "../../asset/descriptors.json!";
import makeAnimations from "./make-animations";
import { OBJLoader } from "../libs/OBJLoader";
import { PLYLoader } from "../libs/PLYLoader";
import * as THREE from "three.js";
import shaderHeader from "../../asset/shader/header.glsl!text";
import animation_scene_json from "../../asset/animation/scene.json!text";
import shader_color_frag from "../../asset/shader/color.frag!text";
import shader_filter_biotope_frag from "../../asset/shader/filter/biotope.frag!text";
import shader_filter_craft_frag from "../../asset/shader/filter/craft.frag!text";
import shader_filter_fullscreen_vert from "../../asset/shader/filter/fullscreen.vert!text";
import shader_filter_paint_frag from "../../asset/shader/filter/paint.frag!text";
import shader_filter_render_frag from "../../asset/shader/filter/render.frag!text";
import shader_filter_terrain_frag from "../../asset/shader/filter/terrain.frag!text";
import shader_mesh_cloud_vert from "../../asset/shader/mesh/cloud.vert!text";
import shader_mesh_grass_vert from "../../asset/shader/mesh/grass.vert!text";
import shader_mesh_land_vert from "../../asset/shader/mesh/land.vert!text";
import shader_mesh_leaf_vert from "../../asset/shader/mesh/leaf.vert!text";
import shader_mesh_skybox_frag from "../../asset/shader/mesh/skybox.frag!text";
import shader_mesh_skybox_vert from "../../asset/shader/mesh/skybox.vert!text";
import shader_mesh_text_frag from "../../asset/shader/mesh/text.frag!text";
import shader_mesh_text_vert from "../../asset/shader/mesh/text.vert!text";
import shader_mesh_tree_frag from "../../asset/shader/mesh/tree.frag!text";
import shader_mesh_tree_vert from "../../asset/shader/mesh/tree.vert!text";
const plyLoader = new PLYLoader();
const objLoader = new OBJLoader();
const fontLoader = new THREE.FontLoader();
export default {
animations: makeAnimations(JSON.parse(animation_scene_json)),
geometries: {
},
fonts: {
},
shaders: {
land: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.land, {
vertexShader: shaderHeader + shader_mesh_land_vert,
fragmentShader: shaderHeader + shader_color_frag,
})),
leaf: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.leaf, {
vertexShader: shaderHeader + shader_mesh_leaf_vert,
fragmentShader: shaderHeader + shader_color_frag,
})),
cloud: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.cloud, {
vertexShader: shaderHeader + shader_mesh_cloud_vert,
fragmentShader: shaderHeader + shader_color_frag,
})),
tree: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.tree, {
vertexShader: shaderHeader + shader_mesh_tree_vert,
fragmentShader: shaderHeader + shader_mesh_tree_frag,
})),
grass: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.grass, {
vertexShader: shaderHeader + shader_mesh_grass_vert,
fragmentShader: shaderHeader + shader_color_frag,
})),
skybox: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.skybox, {
vertexShader: shaderHeader + shader_mesh_skybox_vert,
fragmentShader: shaderHeader + shader_mesh_skybox_frag,
})),
text: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.text, {
vertexShader: shaderHeader + shader_mesh_text_vert,
fragmentShader: shaderHeader + shader_mesh_text_frag,
})),
paint: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.paint, {
vertexShader: shaderHeader + shader_filter_fullscreen_vert,
fragmentShader: shaderHeader + shader_filter_paint_frag,
})),
terrain: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.terrain, {
vertexShader: shaderHeader + shader_filter_fullscreen_vert,
fragmentShader: shaderHeader + shader_filter_terrain_frag,
})),
biotope: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.biotope, {
vertexShader: shaderHeader + shader_filter_fullscreen_vert,
fragmentShader: shaderHeader + shader_filter_biotope_frag,
})),
craft: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.craft, {
vertexShader: shaderHeader + shader_filter_fullscreen_vert,
fragmentShader: shaderHeader + shader_filter_craft_frag,
})),
render: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.render, {
vertexShader: shaderHeader + shader_filter_fullscreen_vert,
fragmentShader: shaderHeader + shader_filter_render_frag,
})),
},
load: function(callback) { return callback(); }
};