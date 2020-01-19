/**
 *
 */

import Model from "./Model";
import Connection from "./Connection";
import ConnectionEnd from "./ConnectionEnd";
import Entity from "./Entity";
import Level from "./Level";
import Method from "./Method";
import Inheritance from "./Inheritance";
import Subtype from "./Subtype";
import Supertype from "./Supertype";

class Attribute {
  constructor(name, type, value, durability, mutability) {
    this.name = name;
    this.type = type;
    this.id = null;
    this.kind = "attribute";
    this.value = value;
    this.durability = durability;
    this.mutability = mutability;
  }

  getName() {
    return this.name;
  }

  getType() {
    return this.type;
  }

  getId() {
    return this.id;
  }
}
export default Attribute;
