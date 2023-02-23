import { _decorator, Collider, Component, ICollisionEvent, Node, SkeletalAnimationComponent } from 'cc';
import { Configs } from '../../utils/Configs';
const { ccclass, property } = _decorator;

@ccclass('Killer_hunter')
export class Killer_hunter extends Component {
    killerAnimator:SkeletalAnimationComponent | null = null;
    isDie : boolean = false;
    start() {
        this.killerAnimator = this.getComponent(SkeletalAnimationComponent);
        this.killerAnimator.play('idle');
        let collider = this.getComponent(Collider)
        collider.on('onCollisionEnter',this.onCollisionEnter,this);
    }
    private onCollisionEnter(event : ICollisionEvent){
        if (this.isDie) return;
        let name = event.otherCollider.node.name;
        if (name.includes(Configs.PLAYER_NAME)){
            
        }


    }
    update(deltaTime: number) {
        
    }
}


