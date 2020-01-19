/**
 *
 */
import Model from "./Model";
import Attribute from "./Attribute";
import Connection from "./Connection";
import ConnectionEnd from "./ConnectionEnd";
import Level from "./Level";
import Method from "./Method";
import Inheritance from "./Inheritance";
import Subtype from "./Subtype";
import Supertype from "./Supertype";

class Entity {

	constructor(name,potency,directType,styleText) {

		this.name=name;
		this.attributes=[];
		this.methods=[];
		this.vertex=null;
		this.id=null;
		this.x=0;
		this.y=0;
		this.w=70;
		this.h=70;
		this.kind="entity";
		this.potency= potency;
		this.directType= directType;
		this.styleText=styleText;
		this.levelNo=null;



		var dt = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (dt + Math.random()*16)%16 | 0;
			dt = Math.floor(dt/16);
			return (c=='x' ? r :(r&0x3|0x8)).toString(16);
		});
		this.secondaryIdEntity= uuid;




	}

	appendToStyle(appendString){

	}

	getName(){
		return this.name;
	}

	createEntity(graph,level){


		var parent = graph.getDefaultParent();
		graph.getModel().beginUpdate();
		try
		{

			//var name = prompt("Please enter the name", "Name");
			//var potency = prompt("Please enter the potency", "0");

			var estyle;

			if (this.styleText!=""){

				estyle = ('horizontal=1;verticalLabelPosition=bottom;verticalAlign=top;resizable=1;movable=1;shape=image;image='+this.styleText);

			}else{
				estyle='entity';

			}

			var cell = graph.getSelectionCells();
			var text
			if (this.directType!=""){
				text=('<b>'+this.name+'</b><sup>'+this.potency+'</sup>:'+this.directType);
			}else
				text=('<b>'+this.name+'</b><sup>'+this.potency+'</sup>');
			this.vertex = graph.insertVertex(level, null, text, this.x, this.y, this.w, this.h,estyle);
			//var v2 = graph.insertVertex(v1, null, 'Name:String', 0, 0, 70, 12,'attribute');
			//var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
			//var e1 = graph.insertEdge(parent, null, '', v1, v2);
			//var group=[v1, v2,e1];

			graph.setSelectionCells(this.vertex);
			this.id=this.vertex.getId();










		}
		finally
		{
			// Updates the display
			graph.getModel().endUpdate();
		}


	}

	addAttribute(attribute) {

		var newLength=this.attributes.push(attribute);

	}

	addMethod(method) {

		var newLength=this.methods.push(method);

	}

	showAttributes(){

		var i;
		for (i=0;i<this.attributes.length;i++){
			alert (""+this.attributes[i].getName());
		}


	}

	showMethods(){

		var i;
		for (i=0;i<this.methods.length;i++){
			alert (""+this.methods[i].getName());
		}


	}

	createFeatures(graph){


		var i,j;
		if (this.styleText!=""){



		}else{


			for (i=0;i<this.attributes.length;i++){
				var text=(" "+this.attributes[i].getType()+": "+this.attributes[i].getName()+"<sup>"+this.attributes[i].durability+"</sup>"+"="+this.attributes[i].value+"<sup>"+this.attributes[i].durability+"</sup>");
				var v1 = graph.insertVertex(this.vertex, null, text, 5, (20*(i))+24, 65,20 ,'attribute;');
				this.attributes[i].id=v1.getId();
			}
			var p1 = graph.insertVertex(this.vertex, null, '', 0, (20*(i))+34, 1,1,'constituent=1;');
			var p2 = graph.insertVertex(this.vertex, null, '', this.vertex.geometry.width, (20*(i))+34, 1,1,'constituent=1;');
			var e1 = graph.insertEdge(this.vertex, null, '', p1, p2,'crossover0;constituent=1;');
			//		e1.geometry.setTerminalPoint(new mxPoint(this.vertex.geometry.x, this.vertex.geometry.x+(12*(this.attributes.length)+24)), true);
			//	e1.geometry.setTerminalPoint(new mxPoint(this.vertex.geometry.x+this.vertex.geometry.width, this.vertex.geometry.x+(12*(this.attributes.length)+24)), false);

			for (j=0;j<this.methods.length;j++){
				var text=(" "+this.methods[j].getName()+"<sup>"+this.methods[j].durability+"</sup>("+this.methods[j].signature+"){ "+this.methods[j].body+" }");
				var v1 = graph.insertVertex(this.vertex, null, text, 6, (20*(i))+44, 65,20 ,'attribute;');
				this.methods[j].id=v1.getId();
				i++;
			}
		}



	}


}
export default Entity;
