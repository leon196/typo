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
import shader_dust_vert from "../../asset/shader/dust.vert!text";
import shader_filter_bloom_bloom_frag from "../../asset/shader/filter/bloom/bloom.frag!text";
import shader_filter_bloom_bloom_vert from "../../asset/shader/filter/bloom/bloom.vert!text";
import shader_filter_bloom_bright_frag from "../../asset/shader/filter/bloom/bright.frag!text";
import shader_filter_bloom_bright_vert from "../../asset/shader/filter/bloom/bright.vert!text";
import shader_filter_bloom_gaussian_blur_frag from "../../asset/shader/filter/bloom/gaussian_blur.frag!text";
import shader_filter_bloom_gaussian_blur_vert from "../../asset/shader/filter/bloom/gaussian_blur.vert!text";
import shader_filter_edge_frag from "../../asset/shader/filter/edge.frag!text";
import shader_filter_fullscreen_vert from "../../asset/shader/filter/fullscreen.vert!text";
import shader_filter_render_frag from "../../asset/shader/filter/render.frag!text";
import shader_mesh_text_frag from "../../asset/shader/mesh/text.frag!text";
import shader_mesh_text_vert from "../../asset/shader/mesh/text.vert!text";
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
dust: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.dust, {
vertexShader: shaderHeader + shader_dust_vert,
fragmentShader: shaderHeader + shader_color_frag,
})),
text: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.text, {
vertexShader: shaderHeader + shader_mesh_text_vert,
fragmentShader: shaderHeader + shader_mesh_text_frag,
})),
bright: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.bright, {
vertexShader: shaderHeader + shader_filter_bloom_bright_vert,
fragmentShader: shaderHeader + shader_filter_bloom_bright_frag,
})),
gaussian_blur: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.gaussian_blur, {
vertexShader: shaderHeader + shader_filter_bloom_gaussian_blur_vert,
fragmentShader: shaderHeader + shader_filter_bloom_gaussian_blur_frag,
})),
bloom: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.bloom, {
vertexShader: shaderHeader + shader_filter_bloom_bloom_vert,
fragmentShader: shaderHeader + shader_filter_bloom_bloom_frag,
})),
edge: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.edge, {
vertexShader: shaderHeader + shader_filter_fullscreen_vert,
fragmentShader: shaderHeader + shader_filter_edge_frag,
})),
render: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.render, {
vertexShader: shaderHeader + shader_filter_fullscreen_vert,
fragmentShader: shaderHeader + shader_filter_render_frag,
})),
},
load: function(callback) { return callback(); }
};