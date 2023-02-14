import { _decorator, Collider, Component,  ITriggerEvent,  tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Door')
export class Door extends Component {
    isOpen:boolean=false;
    start () {
        let collider = this.getComponent(Collider);
        collider.on('onTriggerEnter', this.onTriggerStay, this);
    }
    
    private onTriggerStay (event: ITriggerEvent) {
        if(this.isOpen) return;
        console.log('Open door')
        this.isOpen=true;
        //deactive door
        setTimeout(() => {
            tween(this.node).to(0.5,{eulerAngles:new Vec3(0,90,0)}).start(); 
        }, 1000);

}}


