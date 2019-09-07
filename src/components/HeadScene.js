import React, { Component } from 'react';
import * as THREE from 'three';
import OBJLoader from 'three-obj-loader';
import Dimensions from 'react-dimensions';
import styled from 'styled-components';

// const OrbitControls = require('three-orbit-controls')(THREE);
OBJLoader(THREE);

const StyledSceneWrap = styled.div`
  /* &:hover {
    cursor: ${props => (props.dragging === true ? 'grabbing' : 'grab')};
  } */
  display: ${props => (props.loaded ? 'block' : 'none')}
`;

class HeadScene extends Component {
  state = {
    cameraPosition: new THREE.Vector3(0, 0, 4),
    groupRotation: new THREE.Euler(0, Math.PI * 0, 0),
    obj: null,
    loaded: false
  };

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };

  stop = () => {
    cancelAnimationFrame(this.frameId);
  };

  animate = () => {
    this.group.rotation.y += 0.01;

    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    const width = this.props.containerWidth;
    const height = this.props.containerHeight;

    return (
      <div>
        Front end JavaScript developer. Open Source and everything about web!
      </div>
    );
  }
}

export default Dimensions()(HeadScene);
