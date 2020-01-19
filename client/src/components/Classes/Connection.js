/**
 *
 */
import Model from "./Model";
import Attribute from "./Attribute";
import ConnectionEnd from "./ConnectionEnd";
import Entity from "./Entity";
import Level from "./Level";
import Method from "./Method";
import Inheritance from "./Inheritance";
import Subtype from "./Subtype";
import Supertype from "./Supertype";

class Connection {
  constructor(name, potency, directType, label) {
    this.name = name;
    this.attributes = [];
    this.methods = [];
    this.vertex = null;
    this.id = null;
    this.x = 0;
    this.y = 0;
    this.w = 140;
    this.h = 70;
    this.kind = "connection";
    this.potency = potency;
    this.directType = directType;
    this.label = label;

    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
      c
    ) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    this.secondaryIdConnection = uuid;
  }

  getName() {
    return this.name;
  }

  createConnection(graph, level) {
    var parent = graph.getDefaultParent();
    graph.getModel().beginUpdate();
    try {
      //var name = prompt("Please enter the name", "Name");
      //var potency = prompt("Please enter the potency", "0");

      var cell = graph.getSelectionCells();

      this.vertex = graph.insertVertex(
        level,
        null,
        this.label,
        this.x,
        this.y,
        this.w,
        this.h,
        "connection"
      );
      // var e1 = graph.insertEdge(this.vertex, null, '', 0, 0,'crossover0;constituent=1;');
      var v2 = graph.insertVertex(this.vertex, null, "", 0, 0, 1, 1, "");
      //var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
      //var e1 = graph.insertEdge(parent, null, '', v1, v2);
      //var group=[v1, v2,e1];

      //this.vertex.collapsed = false;
      graph.setSelectionCells(this.vertex);

      this.id = this.vertex.getId();
    } finally {
      // Updates the display
      graph.getModel().endUpdate();
    }
  }

  addAttribute(attribute) {
    var newLength = this.attributes.push(attribute);
  }

  addMethod(method) {
    var newLength = this.methods.push(method);
  }

  showAttributes() {
    var i;
    for (i = 0; i < this.attributes.length; i++) {
      alert("" + this.attributes[i].getName());
    }
  }

  showMethods() {
    var i;
    for (i = 0; i < this.methods.length; i++) {
      alert("" + this.methods[i].getName());
    }
  }

  createFeatures(graph) {
    var i, j;

    for (i = 0; i < this.attributes.length; i++) {
      var text =
        "-" +
        this.attributes[i].getName() +
        ": " +
        this.attributes[i].getType();
      var v1 = graph.insertVertex(
        this.vertex,
        null,
        text,
        5,
        12 * i + 24,
        65,
        12,
        "attribute;"
      );
    }
    var v1 = graph.insertVertex(
      this.vertex,
      null,
      "",
      0,
      12 * i + 30,
      70,
      1,
      "constituent=1;"
    );

    for (j = 0; j < this.methods.length; j++) {
      var text =
        "+" + this.methods[j].getName() + "(): " + this.methods[j].getType();
      var v1 = graph.insertVertex(
        this.vertex,
        null,
        text,
        6,
        12 * i + 34,
        65,
        12,
        "attribute;"
      );
      i++;
    }
  }
}
export default Connection;
