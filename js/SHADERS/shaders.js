'use strict';

const SHADERS = {
    'PHONG_PHONG' : {
        VERTEX : `#version 300 es
precision highp float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightDirection;

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 vVertexColor;

out vec3 vNormal;
out vec3 vEyeVector;
out vec4 vColor;
out vec3 LD;

void main(void) {
  vec4 tempLD = vec4(uLightDirection, 0.0);
  tempLD = uModelViewMatrix * tempLD;
  LD = vec3(tempLD);
  vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
  vEyeVector = -vec3(vertex.xyz);
  vColor = vVertexColor;
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
  gl_PointSize = 1.0;
}
    `,
        FRAGMENT : `#version 300 es
precision highp float;
uniform float uShininess;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uLightSpecular;
uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialSpecular;
uniform bool uPhong;

in vec3 vNormal;
in vec3 vEyeVector;
in vec4 vColor;
in vec3 LD;
out vec4 fragColor;
void main(void) {
  vec3 L = normalize(LD);
  vec3 N = normalize(vNormal);
  float lambertTerm = dot(N, -L);
  vec4 IA = uLightAmbient * uMaterialAmbient;
  vec4 ID = vec4(0.0, 0.0, 0.0, 1.0);
  vec4 IS = vec4(0.0, 0.0, 0.0, 1.0);
  if (lambertTerm > 0.0) {
    ID = uLightDiffuse * uMaterialDiffuse * lambertTerm;
    vec3 E = normalize(vEyeVector);
    vec3 R = reflect(L, N);
    float specular = pow(max(dot(R, E), 0.0), uShininess);
    IA = uLightSpecular * uMaterialSpecular * specular;
  }
  if (uPhong) {
    fragColor = vec4(vec3(IA + ID + IS), 1.0);
  }
  else {
    fragColor = vColor;
  }
}
    `,
  },
};