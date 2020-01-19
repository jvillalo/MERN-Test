/**
 *
 */
import Model from "./Model";
import Attribute from "./Attribute";
import Connection from "./Connection";
import ConnectionEnd from "./ConnectionEnd";
import Entity from "./Entity";
import Level from "./Level";
import Inheritance from "./Inheritance";
import Subtype from "./Subtype";
import Supertype from "./Supertype";

class Method {

	constructor(name,signature,body,durability) {
		this.name=name;

		this.id=null;
		this.signature= signature;
		this.body=body;
		this.durability= durability;
	}

	getName(){
		return this.name;
	}

	getType(){
		return this.type;
	}

	getId(){
		return this.id;
	}


}
export default Method;
