import { _decorator, Collider, Component, ICollisionEvent, ITriggerEvent, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DoorCage')
export class DoorCage extends Component {
   isOpen:boolean=false;
    start () {
        let collider = this.getComponent(Collider);
        collider.on('onTriggerStay', this.onTriggerStay, this);
    }
    
    private onTriggerStay (event: ITriggerEvent) {
        if(this.isOpen) return;
        console.log('door open')
        this.isOpen=true;
        //deactive door
        setTimeout(() => {
            tween(this.node).sequence(
                tween(this.node).by(0.5,{position:new Vec3(-1,0,0)}),
                tween().call(()=>{
                    this.node.destroy();
                })
            ).start();

        }, 300);

    }
}



