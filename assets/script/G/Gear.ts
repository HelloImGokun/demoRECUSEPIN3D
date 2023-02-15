import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Gear')
export class Gear extends Component {
    start() {
        tween(this.node).by(1.0,{eulerAngles:new Vec3(0,0,180)}).repeatForever().start();
    }
}


