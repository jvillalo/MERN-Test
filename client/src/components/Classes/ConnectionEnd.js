/**
 *
 */
import Model from "./Model";
import Attribute from "./Attribute";
import Connection from "./Connection";
import Entity from "./Entity";
import Level from "./Level";
import Method from "./Method";
import Inheritance from "./Inheritance";
import Subtype from "./Subtype";
import Supertype from "./Supertype";
import mxGraph from "mxgraph-js";
import { mxPoint } from "mxgraph-js";

class ConnectionEnd {
  constructor(name, entity, connection, roleName, navigableFrom, lower, upper) {
    this.name = name;
    this.entity = entity;
    this.connection = connection;
    this.edge = null;
    this.id = null;
    this.x = null;
    this.y = null;
    this.kind = "conectionend";
    this.roleName = roleName;
    this.navigableFrom = navigableFrom;
    this.lower = lower;
    this.upper = upper;

    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
      c
    ) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    this.secondaryIdConnectionEnd = uuid;
  }

  getName() {
    return this.name;
  }

  connect(graph, level) {
    graph.isPart = function(cell) {
      var state = this.view.getState(cell);
      var style = state != null ? state.style : this.getCellStyle(cell);

      return style["constituent"] == "1";
    };

    // Redirects selection to parent

    var parent = graph.getDefaultParent();
    graph.getModel().beginUpdate();
    try {
      //var name = prompt("Please enter the name", "Name");
      //var potency = prompt("Please enter the potency", "0");

      this.edge = graph.insertEdge(
        parent,
        null,
        this.name,
        this.connection.vertex,
        this.entity.vertex,
        "crossover" + this.navigableFrom + ";labelPosition=left;align=left"
      );
      //var v11 = graph.insertVertex(this.edge, null, '1', 1, 1, 0, 0, 'labelConn;align=left;verticalAlign=top;', true);

      var v11 = graph.insertVertex(
        this.edge,
        null,
        "1",
        1,
        1,
        15,
        15,
        "labelConn",
        true
      );
      //v11.geometry.offset = new mxPoint(1, 1);

      if (this.x != null && !(this.x == 0 && this.y == 0)) {
        //this.edge.geometry.points[];
        this.edge.getGeometry().points = [new mxPoint(this.x, this.y)];
      }
      //var v16 = graph.insertVertex(this.edge, null, '1', 1, 1, 1, 1, 'labelConn;align=left;verticalAlign=top;fillColor=red;rounded=1', true);
      //v16.geometry.offset = new mxPoint(0, 0);
      //var group=[this.entity.vertex, this.connection.vertex,this.edge];
      //var cell = graph.getSelectionCells();

      //this.vertex = graph.insertVertex(level, null, this.name, 0, 0, 140, 70,'connection');
      //var v2 = graph.insertVertex(v1, null, 'Name:String', 0, 0, 70, 12,'attribute');
      //var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
      //var e1 = graph.insertEdge(parent, null, '', v1, v2);
      //var group=[v1, v2,e1];

      graph.setSelectionCells(this.edge);
      this.id = this.edge.getId();
    } finally {
      // Updates the display
      graph.getModel().endUpdate();
    }
  }
}
export default ConnectionEnd;
