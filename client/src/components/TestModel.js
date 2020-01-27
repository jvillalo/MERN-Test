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
import properties from "./images/properties.gif"
import "./common.css";
import "./mxgraph.css";
import { Link } from "react-router-dom";
import { getPosts } from "../actions/post";
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
    super(props);

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
    //this.socket = socketIOClient();
    //this.getPosts = this.getPosts.bind(this);
  }
  componentDidMount() {
    this.loadGraph();

    this.props.socket.emit("modelrequest", {
      model: this.props.modelId,
      user: this.props.userId,
      project: this.props.projectId
    });

    //socket.on("model", data => this.setState({ json: data }));

    this.props.socket.on("model", msg => {
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
    container.style.height = "70vh";
    container.style.width = "55vw";
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



    mxConnectionHandler.prototype.isConnectableCell = function(cell)
    {
      if (cell!=null){
        var cellId = cell.getId();
        //alert(cellId)
        if(that.modelo.getObjectById(cellId)){
        var style = that.modelo.getObjectById(cellId).kind;
        
        if (style == 'entity'||style == 'connection'||style == 'inheritance') {
          return true;
        }else{ 
          return false;
        }
      }}
    };
    mxConnectionHandler.prototype.isValidTarget = function(cell)
    {
      
      if (cell!=null){
       
        var cellId = cell.getId();
        var style = that.modelo.getObjectById(cellId).kind;
        
        if (style == 'entity'||style == 'connection'||style == 'inheritance') {
          
          return true;
        }else{
          
          return false;
        }
      }
    };


    mxConnectionHandler.prototype.connect = function(source, target, evt, dropTarget)
    {

      if (target!=null){
        var cellId = source.getId();
        var src=that.modelo.getObjectById(cellId);
        var style = src.kind;
        var cellId2 = target.getId();
        var trg=that.modelo.getObjectById(cellId2);
        var styletrg = trg.kind;

        if (that.modelo.getLevelById(source.getParent().getId())==that.modelo.getLevelById(target.getParent().getId())) {
          if (style == 'entity' && styletrg == 'connection'){
            that.connectTo(graph,modelo,source,trg);
          }else{
            if (style == 'entity' && styletrg == 'inheritance'){

              that.subtype(graph,modelo,source,'subtype',trg);
            }else{
              if (style == 'inheritance' && styletrg == 'entity'){
                that.subtype(graph,modelo,target,'supertype',src);
              }else{
                if (style == 'connection' && styletrg == 'entity'){
                  that.connectTo(graph,modelo,target,src);

                }else{

                    if (style == 'entity' && styletrg == 'entity'){
                      alert("dsdsd")
                      that.newQuickConnection(graph,modelo,cellId,src,trg)
                    }

                }
              }
            }
          }
        }else{
          
        }
      }
    };






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

      that.props.socket.emit("modelupdate", {
        model: that.props.modelId,
        user: that.props.userId,
        project: that.props.projectId,
        updateModel: that.modelo.toJSON()
      });
    });
  }

  createPopupMenu(graph, menu, cell, evt, model) {
    var background = document.createElement("div");
    background.style.position = "absolute";
    background.style.left = "0px";
    background.style.top = "0px";
    background.style.right = "0px";
    background.style.bottom = "-1000px";
    background.style.background = "black";
    mxUtils.setOpacity(background, 50);
    document.body.appendChild(background);
    
    background.addEventListener('click', function(evt) {
      mxEffects.fadeOut(background, 50, true, 10, 30, true);
      menu.hideMenu()
    });
    
    const that = this;
    if (cell) {
      var container = ReactDOM.findDOMNode(this.refs.divGraph);
      container.overflow="hidden";
      var cellId = cell.getId();
			if (cellId == 2) {
				menu.addItem('New Level', properties, function () {
					that.newLevel();
				});
				menu.addItem('New Level (At position 0)', properties, function () {
					that.newLevel(0);
				});

				


			}else {
				var style = that.modelo.getObjectById(cellId).kind;


				if (style == 'level') {


					menu.addItem('New Entity', properties, function () {
            that.newEntity();
            mxEffects.fadeOut(background, 50, true, 10, 30, true);

					});
					menu.addItem('New Connection', properties, function () {
						that.newConnection();
					});
					menu.addItem('New Inheritance', properties, function () {
						that.newInheritance();
					});

					var lvl=that.modelo.getObjectById(cellId).levelno;

					if (lvl==that.modelo.levels.length-1) {
						menu.addItem('Delete', properties, function () {

							//var cell = graph.getSelectionCells();
							//var id = cell[0].getId();
							that.modelo.updatePosition();
							that.modelo.remove(cellId);
							that.modelo.build();
						});
					}
				}

				if (style == 'connection') {
					menu.addItem('Properties', properties, function () {

						that.editConnection();
					});
					menu.addItem('Delete', properties, function () {

						//var cell = graph.getSelectionCells();
						//var id = cell[0].getId();
						that.modelo.updatePosition();
						that.modelo.remove(cellId);
						that.modelo.build();
					});


				}


				if (style == 'inheritance') {
					menu.addItem('Properties', properties, function () {

						that.editInheritance();
					});

					menu.addItem('Delete', properties, function () {

						//var cell = graph.getSelectionCells();
						//var id = cell[0].getId();
						that.modelo.updatePosition();
						that.modelo.remove(cellId);
						that.modelo.build();
					});


				}

				if (style == 'subtype') {
					menu.addItem('Properties', properties, function () {

						that.showProperties();
					});

					menu.addItem('Delete', properties, function () {

						//var cell = graph.getSelectionCells();
						//var id = cell[0].getId();
						that.modelo.updatePosition();
						that.modelo.remove(cellId);
						that.modelo.build();
					});


				}


				if (style == 'entity') {
					menu.addItem('Properties', properties, function () {

						that.editEntity();
					});
					menu.addItem('New Attribute', properties, function () {
						that.addNewAttribute();
					});
					menu.addItem('New Method', properties, function () {
						that.addNewMethod();
					});


					menu.addItem('Connect to ->', properties, function () {
						that.connectTo(cell);
					}, null, null, true);

					menu.addItem('Supertype ->', properties, function () {
						that.subtype(cell, 'supertype');
					}, null, null, true);

					menu.addItem('Subtype ->', properties, function () {
						that.subtype(cell, 'subtype');
					}, null, null, true);

					var ent = that.modelo.getObjectById(cellId);
					if ((ent.levelNo < (that.modelo.levels.length - 1))) {
						menu.addItem('Instantiate v', properties, function () {


							that.instEntity(cell, 'subtype');
						}, null, null, true);
					}

					if (ent.levelNo > 0) {
						menu.addItem('Upstantiate ^', properties, function () {
							var found = false;
							for (let k = 0; k < that.modelo.levels[ent.levelNo - 1].entities.length; k++) {
								if (that.modelo.levels[ent.levelNo - 1].entities[k].name == ent.directType) {


									found = true;
									break;
								}

							}
							if (!found) {
								that.upEntity(cell, 'subtype');
							} else {
								alert("This entity already has a parent");
							}
						}, null, null, true);

					}


					if (ent.directType == '') {
						if (true) {
							menu.addItem('Increase Potency', properties, function () {


								var j, k, z, l;
								var found = true;
								var dt = ent.name;
								z = ent.potency;
								ent.potency++;

								var list1 = [], list2 = [];
								list1.push(dt);

								for (j = ent.levelNo + 1; j < that.modelo.levels.length; j++) {
									found = false;
									for (l = 0; l < list1.length; l++) {

										for (k = 0; k < that.modelo.levels[j].entities.length; k++) {
											if (that.modelo.levels[j].entities[k].directType == list1[l]) {
												that.modelo.levels[j].entities[k].potency = z;
												list2.push(that.modelo.levels[j].entities[k].name);

												found = true;
											}
										}


									}

									z--;
									if (found) {
										var list1 = Array.from(list2);
									}
								}

								that.modelo.updatePosition();
								that.modelo.build();

							}, null, null, true);
						}
					}


					var found = false;
					if (ent.levelNo < that.modelo.levels.length - 1) {
						for (let k = 0; k < that.modelo.levels[ent.levelNo + 1].entities.length; k++) {
							if (that.modelo.levels[ent.levelNo + 1].entities[k].directType == ent.name) {


								found = true;
								break;
							}

						}
					}
					if (!found) {
						if (ent.potency > 0) {
							menu.addItem('Decrease Potency', properties, function () {


								var j, k, z, l;
								var found = true;
								var dt = ent.directType;
								var nm = ent.name;
								var entTop;
								//ent.potency--;
								//z=ent.potency;

								for (j = ent.levelNo; j >= 0; j--) {
									for (k = 0; k < that.modelo.levels[j].entities.length; k++) {
										if (that.modelo.levels[j].entities[k].name == nm) {
											if (that.modelo.levels[j].entities[k].directType != '') {
												nm = that.modelo.levels[j].entities[k].directType;
											} else {
												entTop = that.modelo.levels[j].entities[k];
												break;
											}
										}
									}
								}


								var list1 = [], list2 = [];
								list1.push(entTop.name);
								entTop.potency--;
								for (j = entTop.levelNo + 1; j < that.modelo.levels.length; j++) {
									found = false;
									for (l = 0; l < list1.length; l++) {

										for (k = 0; k < that.modelo.levels[j].entities.length; k++) {
											if (that.modelo.levels[j].entities[k].directType == list1[l]) {
												that.modelo.levels[j].entities[k].potency--;
												list2.push(that.modelo.levels[j].entities[k].name);

												found = true;
											}
										}


									}


									if (found) {
										var list1 = Array.from(list2);
									} else {
										break;
									}
								}

								that.modelo.updatePosition();
								that.modelo.build();

							}, null, null, true);
						}
					} else {
						//alert("This entity already has a parent");
					}

					menu.addItem('Delete', properties, function () {

						//var cell = graph.getSelectionCells();
						//var id = cell[0].getId();
						that.modelo.updatePosition();
						that.modelo.remove(cellId);
						that.modelo.build();
					});
				}


			}
		} else {



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
      this.props.socket.emit("modelupdate", {
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
      that.props.socket.emit("modelupdate", {
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

  newConnection = () => {
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
    var labelField = document.createElement("input");
    var potencyField = document.createElement("input");
    var directTypeField = document.createElement("input");

    var okbutton = mxUtils.button("ok", function(evt) {
      const conn1 = new Connection(
        nameField.value,
        potencyField.value,
        directTypeField.value,
        labelField.value
      );
      var idInModel = that.modelo.getLevelById(levelId);

      var cell = that.graph.getSelectionCells();
      if (idInModel == null) {
        var levelId = cell[0].getId();
        idInModel = that.modelo.getLevelById(levelId);
      }
      that.modelo.updatePosition();
      that.modelo.levels[idInModel].addConnection(conn1);
      that.modelo.build();
      wnd.destroy();
      return conn1;
    });
    var cancelButton = mxUtils.button("cancel", function(evt) {
      wnd.destroy();
    });

    testw.appendChild(document.createTextNode("Name: "));
    testw.appendChild(nameField);
    testw.appendChild(document.createElement("br"));
    testw.appendChild(document.createTextNode("Label: "));
    testw.appendChild(labelField);
    testw.appendChild(document.createElement("br"));
    testw.appendChild(document.createTextNode("Potency: "));
    testw.appendChild(potencyField);
    testw.appendChild(document.createElement("br"));
    testw.appendChild(document.createTextNode("Direct type: "));
    testw.appendChild(directTypeField);
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
    wnd = new mxWindow("New Connection", testw, x, y, 200, 200, true, true);
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

 
  newInheritance=()=> {
    const that = this;
		var testw=document.createElement('div');
		testw.style.position = 'absolute';
		testw.style.overflow = 'hidden';
		//outline.style.left = '60px';
		testw.style.top = '0px';
		testw.style.left = '0px';
		testw.style.width = '200px';
		testw.style.height = '500px';
		var wnd=null;
		//var countryList=document.createElement("select");
		//var countryOption = new Option ("jjjj", "jjj");
		//countryList.options.add (countryOption);
		var nameField = document.createElement("input");
		var completeField = document.createElement("input");
		var disjointField = document.createElement("input");




		var okbutton = mxUtils.button('ok', function(evt) {

			let inh1 = new Inheritance(nameField.value,completeField.value,disjointField.value);

			//entity1.styleText=('image='+imageField.value);
			//alert(""+entity1.styleText);
			var cell = that.graph.getSelectionCells();
			var levelId = cell[0].getId();
			var idInModel = that.modelo.getLevelById(levelId);
			that.modelo.updatePosition();
			that.modelo.levels[idInModel].addInheritance(inh1);
			that.modelo.build();
			wnd.destroy();

		});
		var cancelButton = mxUtils.button('cancel', function(evt) {
			wnd.destroy();
		});

		testw.appendChild(document.createTextNode("Name: "));
		testw.appendChild(nameField);
		testw.appendChild(document.createElement("br"));
		testw.appendChild(document.createTextNode("Complete: "));
		testw.appendChild(completeField);
		testw.appendChild(document.createElement("br"));
		testw.appendChild(document.createTextNode("Disjoint: "));
		testw.appendChild(disjointField);
		testw.appendChild(document.createElement("br"));

		testw.appendChild(okbutton);
		testw.appendChild(cancelButton);
		var x = Math.max(0, document.body.scrollWidth / 2 - 200 / 2);
		var y = Math.max(10, (document.body.scrollHeight ||
				document.documentElement.scrollHeight) / 2 - 200 * 2 / 3);
		wnd = new mxWindow('New Inheritance', testw, x, y, 200, 200, true, true);
		wnd.setMaximizable(false);
		wnd.setMinimizable(false);
		wnd.setResizable(true);
		wnd.setVisible(true);
		wnd.setResizable(false);


		var background = document.createElement('div');
		background.style.position = 'absolute';
		background.style.left = '0px';
		background.style.top = '0px';
		background.style.right = '0px';
		background.style.bottom = '0px';
		background.style.background = 'black';
		mxUtils.setOpacity(background, 50);
		document.body.appendChild(background);



		// Fades the background out after after the window has been closed
		wnd.addListener(mxEvent.DESTROY, function(evt) {
			mxEffects.fadeOut(background, 50, true,
					10, 30, true);
		});

		wnd.setVisible(true);
	};


   editConnection=()=> {
    const that = this;
		var testw=document.createElement('div');
		testw.style.position = 'absolute';
		testw.style.overflow = 'hidden';
		//outline.style.left = '60px';
		testw.style.top = '0px';
		testw.style.left = '0px';
		testw.style.width = '200px';
		testw.style.height = '500px';
		var wnd=null;
		//var countryList=document.createElement("select");
		//var countryOption = new Option ("jjjj", "jjj");
		//countryList.options.add (countryOption);
		var nameField = document.createElement("input");
		var labelField = document.createElement("input");
		var potencyField = document.createElement("input");
		var directTypeField = document.createElement("input");



		var okbutton = mxUtils.button('ok', function(evt) {


			that.modelo.getObjectById(that.graph.getSelectionCells()[0].getId()).name=nameField.value;
			that.modelo.getObjectById(that.graph.getSelectionCells()[0].getId()).label=labelField.value;
			that.modelo.getObjectById(that.graph.getSelectionCells()[0].getId()).potency=potencyField.value;
			that.modelo.getObjectById(that.graph.getSelectionCells()[0].getId()).directType=directTypeField.value;


			that.modelo.updatePosition();
			that.modelo.build();
			wnd.destroy();

		});
		var cancelButton = mxUtils.button('cancel', function(evt) {
			wnd.destroy();
		});
		let conn1=that.modelo.getObjectById(that.graph.getSelectionCells()[0].getId());
		testw.appendChild(document.createTextNode("Name: "));
		nameField.value=conn1.name;
		testw.appendChild(nameField);
		testw.appendChild(document.createElement("br"));
		testw.appendChild(document.createTextNode("Label: "));
		labelField.value=conn1.label;
		testw.appendChild(labelField);
		testw.appendChild(document.createElement("br"));
		testw.appendChild(document.createTextNode("Potency: "));
		potencyField.value=conn1.potency;
		testw.appendChild(potencyField);
		testw.appendChild(document.createElement("br"));
		testw.appendChild(document.createTextNode("Direct type: "));
		directTypeField.value=conn1.directType;
		testw.appendChild(directTypeField);
		testw.appendChild(document.createElement("br"));
		testw.appendChild(okbutton);
		testw.appendChild(cancelButton);
		var x = Math.max(0, document.body.scrollWidth / 2 - 200 / 2);
		var y = Math.max(10, (document.body.scrollHeight ||
				document.documentElement.scrollHeight) / 2 - 200 * 2 / 3);
		wnd = new mxWindow(conn1.name, testw, x, y, 200, 200, true, true);
		wnd.setMaximizable(false);
		wnd.setMinimizable(false);
		wnd.setResizable(true);
		wnd.setVisible(true);
		wnd.setResizable(false);


		var background = document.createElement('div');
		background.style.position = 'absolute';
		background.style.left = '0px';
		background.style.top = '0px';
		background.style.right = '0px';
		background.style.bottom = '0px';
		background.style.background = 'black';
		mxUtils.setOpacity(background, 50);
		document.body.appendChild(background);



		// Fades the background out after after the window has been closed
		wnd.addListener(mxEvent.DESTROY, function(evt) {
			mxEffects.fadeOut(background, 50, true,
					10, 30, true);
		});

		wnd.setVisible(true);
	};




 connectTo=(cell,target) =>{
  const that = this;
		var testw=document.createElement('div');
		testw.style.position = 'absolute';
		testw.style.overflow = 'hidden';
		//outline.style.left = '60px';
		testw.style.top = '0px';
		testw.style.left = '0px';
		testw.style.width = '200px';
		testw.style.height = '500px';
		var wnd=null;
		//var countryList=document.createElement("select");
		//var countryOption = new Option ("jjjj", "jjj");
		//countryList.options.add (countryOption);
		var connectionsList=document.createElement("select");
		var levelId = cell.getParent().getId();

		var idInModel = that.modelo.getLevelById(levelId);

		var conns = that.modelo.levels[idInModel].connections;
		var i;

		for (i = 0; i < conns.length; i++) {

			var connection = conns[i];
			//var connOption = new Option (i, ("   "+connection.name+"  "));
			connectionsList.options.add(new Option (("   "+connection.name+"  "),i));




		}



		var nameField = document.createElement("input");
		var roleField = document.createElement("input");
		var navigableField = document.createElement("input");
		var lowerField = document.createElement("input");
		var upperField = document.createElement("input");



		var okbutton = mxUtils.button('ok', function(evt) {


			var entityId = cell.getId();
			var entity = that.modelo.getEntityById(entityId);
			//alert(""+connectionsList.value);
			var connection;

			if (target!=null){
				connection=target;
			}else{
				connection=conns[connectionsList.value];
			}
			let end1 = new ConnectionEnd(nameField.value, entity, connection,roleField.value,navigableField.value,lowerField.value,upperField.value);
      that.modelo.updatePosition();
			that.modelo.levels[idInModel].addConnectionEnd(end1);
			that.modelo.build();

			wnd.destroy();

		});
		var cancelButton = mxUtils.button('cancel', function(evt) {
			wnd.destroy();
		});

		testw.appendChild(document.createTextNode("Name: "));
		testw.appendChild(nameField);
		testw.appendChild(document.createElement("br"));
		if (target!=null){

		}else{


			testw.appendChild(document.createTextNode("Connection: "));
			testw.appendChild(connectionsList);
			testw.appendChild(document.createElement("br"));
		}
		testw.appendChild(document.createTextNode("Role Name: "));
		testw.appendChild(roleField);
		testw.appendChild(document.createElement("br"));
		testw.appendChild(document.createTextNode("navigableFrom: "));
		testw.appendChild(navigableField);
		testw.appendChild(document.createElement("br"));
		testw.appendChild(document.createTextNode("Lower: "));
		testw.appendChild(lowerField);
		testw.appendChild(document.createElement("br"));
		testw.appendChild(document.createTextNode("Upper: "));
		testw.appendChild(upperField);
		testw.appendChild(document.createElement("br"));
		testw.appendChild(okbutton);
		testw.appendChild(cancelButton);
		var x = Math.max(0, document.body.scrollWidth / 2 - 200 / 2);
		var y = Math.max(10, (document.body.scrollHeight ||
				document.documentElement.scrollHeight) / 2 - 200 * 2 / 3);
		wnd = new mxWindow('Connect to', testw, x, y, 200, 200, true, true);
		wnd.setMaximizable(false);
		wnd.setMinimizable(false);
		wnd.setResizable(true);
		wnd.setVisible(true);
		wnd.setResizable(false);


		var background = document.createElement('div');
		background.style.position = 'absolute';
		background.style.left = '0px';
		background.style.top = '0px';
		background.style.right = '0px';
		background.style.bottom = '0px';
		background.style.background = 'black';
		mxUtils.setOpacity(background, 50);
		document.body.appendChild(background);



		// Fades the background out after after the window has been closed
		wnd.addListener(mxEvent.DESTROY, function(evt) {
			mxEffects.fadeOut(background, 50, true,
					10, 30, true);
		});

		wnd.setVisible(true);



	};







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
