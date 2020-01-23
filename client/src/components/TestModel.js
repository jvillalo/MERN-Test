import React, { Component } from "react";
import ReactDOM from "react-dom";
import Model from "./Classes/Model";
import Attribute from "./Classes/Attribute";
import Connection from "./Classes/Connection";
import ConnectionEnd from "./Classes/ConnectionEnd";
import Entity from "./Classes/Entity";
import Level from "./Classes/Level";
import Method from "./Classes/Method";
import Inheritance from "./Classes/Inheritance";
import Subtype from "./Classes/Subtype";
import Supertype from "./Classes/Supertype";
import socketIOClient from "socket.io-client";
import "./common.css";
import "./mxgraph.css";
import { Link } from "react-router-dom";

import {
  mxGraph,
  mxParallelEdgeLayout,
  mxConstants,
  mxEdgeStyle,
  mxLayoutManager,
  mxGraphHandler,
  mxGuide,
  mxEdgeHandler,
  mxCell,
  mxGeometry,
  mxRubberband,
  mxDragSource,
  mxKeyHandler,
  mxCodec,
  mxClient,
  mxConnectionHandler,
  mxUtils,
  mxToolbar,
  mxEvent,
  mxImage,
  mxConstraintHandler,
  mxFastOrganicLayout,
  mxUndoManager,
  mxObjectCodec,
  mxHierarchicalLayout,
  mxConnectionConstraint,
  mxCellState,
  mxPoint,
  mxGraphModel,
  mxPerimeter,
  mxCompactTreeLayout,
  mxCellOverlay,
  mxForm,
  mxDivResizer,
  mxWindow,
  mxEffects
} from "mxgraph-js";

class TestModel extends Component {
  constructor(props) {
    super();

    this.state = {
      graph: {},
      layout: {},
      json: "",
      dragElt: null,
      createVisile: false,
      currentNode: null,
      currentTask: "",
      reload: false,
      selectedCell: 0
    };

    this.loadGraph = this.loadGraph.bind(this);
    this.setGraphSetting = this.setGraphSetting.bind(this);
    this.createPopupMenu = this.createPopupMenu.bind(this);
    this.socket = socketIOClient();
  }
  componentDidMount() {
    this.loadGraph();

    this.socket.emit("modelrequest", {
      model: this.props.modelId,
      user: this.props.userId,
      project: this.props.projectId
    });
    //socket.on("model", data => this.setState({ json: data }));

    this.socket.on("model", msg => {
      //this.setState({ selectedCell: graph.getSelectionCell().getId() });
      //alert(`Model received: ${msg}`);
      var selected = 0;
      if (this.graph.getSelectionCell()) {
        selected = this.graph.getSelectionCell().getId();
      }
      this.setState({
        json: msg,
        selectedCell: selected
      });

      this.reload();
    });
  }

  loadGraph() {
    var container = ReactDOM.findDOMNode(this.refs.divGraph);
    //container.style.position = "relative";
    //container.style.top = "400px";
    container.style.position = "relative";
    container.style.height = "75vh";
    container.style.width = "120vh";
    //container.style.align = "left";
    //container.style.overflow = "hidden";
    //container.style.left = "0px";
    container.style.top = "0px";
    //container.style.right = "0px";
    //container.style.bottom = "36px";
    //container.style.background = 'url("images/grid.gif")';
    container.style.backgroundColor = "#fcfcfc";
    container.style.overflow = "scroll";
    this.graph = new mxGraph(container);

    this.modelo = new Model("Model1", "jorge", this.graph);
    //this.setState({ graph: graph });

    const that = this;

    mxEvent.disableContextMenu(container);
    this.setGraphSetting(this.graph, this.modelo);

    this.paint(this.graph);

    //modelo.works();
    //modelo.fromJSON(this.state.json);
    //modelo.build();
  }

  paint(graph) {}

  render() {
    /* if (this.state.reload) {
      this.reload();
    } */
    return <div className="container" ref="divGraph" />;
  }

  setGraphSetting(graph, modelo) {
    //const { graph } = this.state;
    const that = this;
    graph.gridSize = 30;
    graph.setPanning(true);
    graph.setTooltips(true);
    graph.setConnectable(true);
    graph.setCellsEditable(true);
    graph.setEnabled(that.props.editAuthorized);
    graph.graphHandler.setRemoveCellsFromParent(false);

    mxEdgeHandler.prototype.snapToTerminals = true;

    graph.setHtmlLabels(true);

    //graph.centerZoom = true;
    // Autosize labels on insert where autosize=1
    graph.autoSizeCellsOnAdd = true;

    const keyHandler = new mxKeyHandler(graph);

    new mxRubberband(graph);
    graph.getTooltipForCell = function(cell) {
      return cell.getAttribute("desc");
    };
    var style = graph.getStylesheet().getDefaultVertexStyle();
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
    style[mxConstants.STYLE_EDITABLE] = 0;
    style[mxConstants.STYLE_MOVABLE] = 0;
    style[mxConstants.STYLE_RESIZABLE] = 0;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = "middle";
    style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = "white";
    style[mxConstants.STYLE_FONTSIZE] = 11;
    style[mxConstants.STYLE_STARTSIZE] = 22;
    style[mxConstants.STYLE_HORIZONTAL] = false;
    style[mxConstants.STYLE_FONTCOLOR] = "black";
    style[mxConstants.STYLE_STROKECOLOR] = "black";
    style[mxConstants.STYLE_FILLCOLOR] = "white";
    style[mxConstants.SHADOW_OPACITY] = 0.5;
    style[mxConstants.SHADOWCOLOR] = "#C0C0C0";
    style[mxConstants.SHADOW_OFFSET_X] = 5;
    style[mxConstants.SHADOW_OFFSET_Y] = 6;
    style[mxConstants.STYLE_FOLDABLE] = false;
    style[mxConstants.STYLE_SWIMLANE_FILLCOLOR] = "white";

    style = mxUtils.clone(style);
    //style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
    style[mxConstants.STYLE_RESIZABLE] = 1;
    style[mxConstants.STYLE_MOVABLE] = 1;
    style[mxConstants.STYLE_FONTSIZE] = 10;
    style[mxConstants.STYLE_ROUNDED] = false;
    style[mxConstants.STYLE_HORIZONTAL] = true;

    delete style[mxConstants.STYLE_VERTICAL_ALIGN];
    delete style[mxConstants.STYLE_STARTSIZE];
    style[mxConstants.STYLE_SHADOW] = "1";

    //style[mxConstants.STYLE_FILLCOLOR]='none';
    //style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'none';
    //style[mxConstants.STYLE_STROKECOLOR] = 'none';
    //style[mxConstants.STYLE_IMAGE]='jorge.jpg';
    //style[mxConstants.STYLE_IMAGE_WIDTH]=140;
    //style[mxConstants.STYLE_IMAGE_HEIGHT]=70;

    graph.getStylesheet().putCellStyle("entity", style);
    style = mxUtils.clone(style);
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_ARCSIZE] = 50;
    style[mxConstants.STYLE_FOLDABLE] = true;
    style[mxConstants.STYLE_SHADOW] = "1";

    graph.getStylesheet().putCellStyle("connection", style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
    style[mxConstants.STYLE_RESIZABLE] = 1;
    style[mxConstants.STYLE_MOVABLE] = 1;
    style[mxConstants.STYLE_FONTSIZE] = 10;
    style[mxConstants.STYLE_ROUNDED] = false;
    style[mxConstants.STYLE_HORIZONTAL] = true;
    delete style[mxConstants.STYLE_VERTICAL_ALIGN];
    delete style[mxConstants.STYLE_STARTSIZE];
    //style[mxConstants.STYLE_FILLCOLOR]='none';
    //style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'none';
    //style[mxConstants.STYLE_STROKECOLOR] = 'none';
    //style[mxConstants.STYLE_IMAGE]='jorge.jpg';
    //style[mxConstants.STYLE_IMAGE_WIDTH]=140;
    //style[mxConstants.STYLE_IMAGE_HEIGHT]=70;
    graph.getStylesheet().putCellStyle("inheritance", style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
    style[mxConstants.STYLE_ROUNDED] = false;
    style[mxConstants.STYLE_RESIZABLE] = 0;
    style[mxConstants.STYLE_MOVABLE] = 0;
    style[mxConstants.STYLE_FONTSIZE] = 10;
    style[mxConstants.STYLE_HORIZONTAL] = true;
    style[mxConstants.STYLE_STROKECOLOR] = "none";
    delete style[mxConstants.STYLE_STARTSIZE];
    style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = "none";
    style[mxConstants.STYLE_FILLCOLOR] = "none";
    style[mxConstants.STYLE_ALIGN] = "left";
    graph.getStylesheet().putCellStyle("attribute", style);
    graph.getStylesheet().putCellStyle("method", style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
    style[mxConstants.STYLE_RESIZABLE] = 1;
    style[mxConstants.STYLE_MOVABLE] = 1;
    style[mxConstants.STYLE_FONTSIZE] = 10;
    style[mxConstants.STYLE_ROUNDED] = false;
    style[mxConstants.STYLE_HORIZONTAL] = true;
    delete style[mxConstants.STYLE_VERTICAL_ALIGN];
    delete style[mxConstants.STYLE_STARTSIZE];
    //style[mxConstants.STYLE_FILLCOLOR]='none';
    //style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'none';
    //style[mxConstants.STYLE_STROKECOLOR] = 'none';
    //style[mxConstants.STYLE_IMAGE]='jorge.jpg';
    //style[mxConstants.STYLE_IMAGE_WIDTH]=140;
    //style[mxConstants.STYLE_IMAGE_HEIGHT]=70;

    graph.getStylesheet().putCellStyle("labelConn", style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
    delete style[mxConstants.STYLE_ROUNDED];
    graph.getStylesheet().putCellStyle("state", style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RHOMBUS;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RhombusPerimeter;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = "top";
    style[mxConstants.STYLE_SPACING_TOP] = 40;
    style[mxConstants.STYLE_SPACING_RIGHT] = 64;
    graph.getStylesheet().putCellStyle("condition", style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_DOUBLE_ELLIPSE;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
    style[mxConstants.STYLE_SPACING_TOP] = 28;
    style[mxConstants.STYLE_FONTSIZE] = 14;
    style[mxConstants.STYLE_FONTSTYLE] = 1;
    delete style[mxConstants.STYLE_SPACING_RIGHT];
    graph.getStylesheet().putCellStyle("end", style);

    style = graph.getStylesheet().getDefaultEdgeStyle();
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
    style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK;
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_FONTCOLOR] = "black";
    style[mxConstants.STYLE_STROKECOLOR] = "black";

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_MOVABLE] = 0;
    style[mxConstants.STYLE_RESIZABLE] = 0;
    style[mxConstants.STYLE_EDITABLE] = 0;
    style[mxConstants.STYLE_DASHED] = false;
    style[mxConstants.STYLE_ENDARROW] = "none";
    style[mxConstants.STYLE_STARTARROW] = "none";
    graph.getStylesheet().putCellStyle("crossover0", style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_MOVABLE] = 0;
    style[mxConstants.STYLE_RESIZABLE] = 0;
    style[mxConstants.STYLE_EDITABLE] = 0;
    style[mxConstants.STYLE_DASHED] = false;
    style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_OPEN;
    style[mxConstants.STYLE_STARTARROW] = "none";
    graph.getStylesheet().putCellStyle("crossover1", style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_MOVABLE] = 0;
    style[mxConstants.STYLE_RESIZABLE] = 0;
    style[mxConstants.STYLE_EDITABLE] = 0;
    style[mxConstants.STYLE_DASHED] = false;
    style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK;
    style[mxConstants.STYLE_ENDFILL] = 0;
    style[mxConstants.STYLE_STARTARROW] = "none";
    graph.getStylesheet().putCellStyle("supertype", style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_MOVABLE] = 0;
    style[mxConstants.STYLE_RESIZABLE] = 0;
    style[mxConstants.STYLE_EDITABLE] = 0;
    style[mxConstants.STYLE_DASHED] = false;
    style[mxConstants.STYLE_ENDARROW] = "none";
    style[mxConstants.STYLE_STARTARROW] = "none";
    graph.getStylesheet().putCellStyle("subtype", style);

    graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
      return that.createPopupMenu(graph, menu, cell, evt, modelo);
    };

    graph.addListener(mxEvent.CELLS_MOVED, function(sender, evt) {
      that.setState({ selectedCell: graph.getSelectionCell().getId() });
      that.modelo.updatePosition();

      //this.setState({ json: modelo.toJSON(), reload: true });

      that.socket.emit("modelupdate", {
        model: that.props.modelId,
        user: that.props.userId,
        project: that.props.projectId,
        updateModel: that.modelo.toJSON()
      });
    });
  }

  createPopupMenu(graph, menu, cell, evt, model) {
    const that = this;
    if (cell) {
      var cellId = cell.getId();
      if (cellId == 2) {
        menu.addItem("New Level", "images/properties.gif", function() {
          that.newLevel();
        });
        menu.addItem(
          "New Level (At position 0)",
          "images/properties.gif",
          function() {
            that.newLevel(0);
          }
        );

        menu.addItem("Delete Model", "images/properties.gif", function() {});
      } else {
        switch (this.modelo.getObjectById(cellId).kind) {
          case "level":
            menu.addItem("New Entity", "images/properties.gif", function() {
              that.newEntity();
            });
            menu.addItem("New Connection", "images/properties.gif", function() {
              that.newConnection(graph, model);
            });
            menu.addItem(
              "New Inheritance",
              "images/properties.gif",
              function() {
                that.newInheritance(graph, model);
              }
            );

            var lvl = this.modelo.getObjectById(cellId).levelno;

            if (lvl == this.modelo.levels.length - 1) {
              menu.addItem("Delete", "images/properties.gif", function() {
                //var cell = graph.getSelectionCells();
                //var id = cell[0].getId();
                this.modelo.updatePosition();
                this.modelo.remove(cellId);
                this.modelo.build();
              });
            }
            break;

            // code block
            break;
          default:
          // code block
        }
      }
    }
  }

  newLevel(where) {
    // Creates a form for the user object inside
    // the cell

    var txt = "2";
    var form = new mxForm("New Level");

    // Adds a field for the columnname
    var nameField = form.addText("Name", "Level 0");

    var wnd = null;

    // Defines the function to be executed when the
    // OK button is pressed in the dialog
    var okFunction = () => {
      var level1 = new Level(nameField.value, this.graph);

      this.modelo.updatePosition();

      if (where != null) {
        this.modelo.addLevel(level1, where);
      } else {
        this.modelo.addLevel(level1, null);
      }

      //this.setState({ json: modelo.toJSON(), reload: true });

      //this.socket.emit("modelupdate", this.modelo.toJSON());
      this.socket.emit("modelupdate", {
        model: this.props.modelId,
        user: this.props.userId,
        project: this.props.projectId,
        updateModel: this.modelo.toJSON()
      });

      //modelo.fromJSON(this.state.json);
      //modelo.build();
      //toolbarWindow.setVisible(true);

      //this.reload();
      wnd.destroy();
    };

    // Defines the function to be executed when the
    // Cancel button is pressed in the dialog
    var cancelFunction = () => {
      //toolbarWindow.setVisible(true);
      wnd.destroy();
    };
    form.addButtons(okFunction, cancelFunction);

    var parent = this.graph.getDefaultParent();

    wnd = this.showModalWindow("New Level", form.table, 240, 240);
  }

  reload = () => {
    this.modelo = new Model("", "", this.graph);
    this.modelo.fromJSON(this.state.json);
    this.modelo.build();
    this.graph.getView().setScale(0.6);

    //this.graph.setSelectionCells(this.graph.getModel().getCell(12));
    this.graph.selectCellForEvent(
      this.graph.getModel().getCell(this.state.selectedCell)
    );
    //this.setState({ reload: false });
  };

  newEntity = () => {
    const that = this;
    var testw = document.createElement("div");
    testw.style.position = "absolute";
    testw.style.overflow = "hidden";
    //outline.style.left = '60px';
    testw.style.top = "0px";
    testw.style.left = "0px";
    testw.style.width = "200px";
    testw.style.height = "500px";
    var wnd = null;
    //var countryList=document.createElement("select");
    //var countryOption = new Option ("jjjj", "jjj");
    //countryList.options.add (countryOption);
    var nameField = document.createElement("input");
    var potencyField = document.createElement("input");
    var directTypeField = document.createElement("input");
    var imageField = document.createElement("input");

    var okbutton = mxUtils.button("ok", function(evt) {
      var entity1 = new Entity(nameField.value, 0, "", imageField.value);

      //entity1.styleText=('image='+imageField.value);
      //alert(""+entity1.styleText);
      var cell = that.graph.getSelectionCells();
      var levelId = cell[0].getId();
      var idInModel = that.modelo.getLevelById(levelId);
      that.modelo.updatePosition();
      that.modelo.levels[idInModel].addEntity(entity1);
      //that.socket.emit("modelupdate", that.modelo.toJSON());
      that.socket.emit("modelupdate", {
        model: that.props.modelId,
        user: that.props.userId,
        project: that.props.projectId,
        updateModel: that.modelo.toJSON()
      });
      wnd.destroy();
    });
    var cancelButton = mxUtils.button("cancel", function(evt) {
      wnd.destroy();
    });

    testw.appendChild(document.createTextNode("Name: "));
    testw.appendChild(nameField);
    testw.appendChild(document.createElement("br"));
    //testw.appendChild(document.createTextNode("Potency: "));
    //testw.appendChild(potencyField);
    //testw.appendChild(document.createElement("br"));
    //testw.appendChild(document.createTextNode("Direct type: "));
    //testw.appendChild(directTypeField);
    //testw.appendChild(document.createElement("br"));
    testw.appendChild(document.createTextNode("Image URL: "));
    testw.appendChild(imageField);
    testw.appendChild(document.createElement("br"));
    testw.appendChild(okbutton);
    testw.appendChild(cancelButton);
    var x = Math.max(0, document.body.scrollWidth / 2 - 200 / 2);
    var y = Math.max(
      10,
      (document.body.scrollHeight || document.documentElement.scrollHeight) /
        2 -
        (200 * 2) / 3
    );
    wnd = new mxWindow("New Entity", testw, x, y, 200, 200, true, true);
    wnd.setMaximizable(false);
    wnd.setMinimizable(false);
    wnd.setResizable(true);
    wnd.setVisible(true);
    wnd.setResizable(false);

    var background = document.createElement("div");
    background.style.position = "absolute";
    background.style.left = "0px";
    background.style.top = "0px";
    background.style.right = "0px";
    background.style.bottom = "0px";
    background.style.background = "black";
    mxUtils.setOpacity(background, 50);
    document.body.appendChild(background);

    // Fades the background out after after the window has been closed
    wnd.addListener(mxEvent.DESTROY, function(evt) {
      mxEffects.fadeOut(background, 50, true, 10, 30, true);
    });

    wnd.setVisible(true);
  };

  newConnection(graph, model) {}

  newInheritance(graph, model) {}

  showModalWindow(title, content, width, height) {
    var background = document.createElement("div");
    background.style.position = "absolute";
    background.style.left = "0px";
    background.style.top = "0px";
    background.style.right = "0px";
    background.style.bottom = "0px";
    background.style.background = "black";
    mxUtils.setOpacity(background, 50);
    document.body.appendChild(background);

    if (mxClient.IS_QUIRKS) {
      new mxDivResizer(background);
    }

    var x = Math.max(0, document.body.scrollWidth / 2 - width / 2);
    var y = Math.max(
      10,
      (document.body.scrollHeight || document.documentElement.scrollHeight) /
        2 -
        (height * 2) / 3
    );
    var wnd = new mxWindow(title, content, x, y, width, height, true, true);

    wnd.setClosable(true);

    // Fades the background out after after the window has been closed
    wnd.addListener(mxEvent.DESTROY, function(evt) {
      mxEffects.fadeOut(background, 50, true, 10, 30, true);
    });

    wnd.setVisible(true);

    return wnd;
  }
}

export default TestModel;
