/**
 *
 */
import Model from "./Model";
import Attribute from "./Attribute";
import Connection from "./Connection";
import ConnectionEnd from "./ConnectionEnd";
import Entity from "./Entity";
import Method from "./Method";
import Inheritance from "./Inheritance";
import Subtype from "./Subtype";
import Supertype from "./Supertype";

class Level {
  constructor(name, graph) {
    this.graph = graph;
    this.name = name;
    this.entities = [];
    this.connections = [];
    this.connectionEnds = [];
    this.supertypes = [];
    this.subtypes = [];
    this.inheritances = [];
    this.v1 = null;
    this.v2 = null;
    this.id = null;
    this.kind = "level";
    this.levelIndex = null;
    this.levelno = null;
  }

  getName() {
    return this.name;
  }

  createLevel(graph, index, container) {
    var parent = graph.getDefaultParent();
    graph.getModel().beginUpdate();
    try {
      //var name = this.name;
      //var potency = prompt("Please enter the potency", "0");
      this.v1 = graph.insertVertex(
        container,
        null,
        this.name,
        0,
        index * 450 + 22,
        1500,
        450,
        ""
      );
      //this.v2 = graph.insertVertex(this.v1, null, '',22,0, this.v1.geometry.width, this.v1.geometry.height,'shape=rectangle;constituent=1');
      //var e1 = graph.insertEdge(parent, null, '', v1, v2);
      //var group=[v1, v2,e1];

      graph.setSelectionCells(this.v1);

      this.id = this.v1.getId();
    } finally {
      // Updates the display
      graph.getModel().endUpdate();
    }
  }

  addEntity(entity) {
    var newLength = this.entities.push(entity);
  }

  addConnection(connection) {
    var newLength = this.connections.push(connection);
  }
  addConnectionEnd(connectionEnd) {
    var newLength = this.connectionEnds.push(connectionEnd);
  }
  addSupertype(supertype) {
    var newLength = this.supertypes.push(supertype);
  }
  addSubtype(subtype) {
    var newLength = this.subtypes.push(subtype);
  }
  addInheritance(inheritance) {
    var newLength = this.inheritances.push(inheritance);
  }

  showEntities() {
    var i;
    for (i = 0; i < this.entities.length; i++) {}
  }

  showConnections() {
    var i;
    for (i = 0; i < this.connections.length; i++) {}
  }

  showConnectionEnds() {
    var i;
    for (i = 0; i < this.connectionEnds.length; i++) {}
  }

  showSupertypes() {
    var i;
    for (i = 0; i < this.supertypes.length; i++) {}
  }
  showSubtypes() {
    var i;
    for (i = 0; i < this.subtypes.length; i++) {}
  }

  createEntities() {
    var i;

    for (i = 0; i < this.entities.length; i++) {
      this.entities[i].createEntity(this.graph, this.v1);
      //this.levelIndex++;
    }
  }

  createConnections() {
    var i;

    for (i = 0; i < this.connections.length; i++) {
      this.connections[i].createConnection(this.graph, this.v1);
      //this.levelIndex++;
    }
  }

  createInheritances() {
    var i;

    for (i = 0; i < this.inheritances.length; i++) {
      this.inheritances[i].createInheritance(this.graph, this.v1);
      //this.levelIndex++;
    }
  }

  connect() {
    var i;

    for (i = 0; i < this.connectionEnds.length; i++) {
      this.connectionEnds[i].connect(this.graph, this.v1);
      //this.levelIndex++;
    }
  }

  superconnect() {
    var i;

    for (i = 0; i < this.supertypes.length; i++) {
      this.supertypes[i].connect(this.graph, this.v1);
      //this.levelIndex++;
    }
  }
}

export default Level;
