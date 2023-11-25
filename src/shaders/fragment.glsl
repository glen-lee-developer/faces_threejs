varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uTexture;
float PI = 3.141592653589793238;

void main() {
     
    gl_FragColor = vec4( vUv,0., 1.0 );
}