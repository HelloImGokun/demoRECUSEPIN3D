import { _decorator, Collider, Component, geometry, ITriggerEvent, Node, physics, PhysicsSystem, RigidBody, SkeletalAnimationComponent, tween, Vec3 } from 'cc';
import { Configs } from '../../utils/Configs';
import { PlayerController } from '../controller/PlayerController';
const { ccclass, property } = _decorator;

@ccclass('Tiger')
export class Tiger extends Component {
    animator: SkeletalAnimationComponent | null = null;
    //create a raycast
    LOG_NAME = null;
    isDie: boolean = false;
    isAttack: boolean = false;
    start() {
        this.LOG_NAME = this.node.name;
        let collider = this.getComponent(Collider);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
        this.animator = this.node.getComponent(SkeletalAnimationComponent);
        this.animator.play('Idle')

    }
    private onTriggerEnter(event: ITriggerEvent) {
        let otherNode: Node = event.otherCollider.node;
        let name = otherNode.name;
        // lao vao nguoi tan cong
        if (name.includes(Configs.PLAYER_NAME)) {
            //attack
            if (this.isAttack) return;
            this.isAttack = true;
            this.animator.play('Attack');
            this.scheduleOnce(() => {
                this.isAttack = false;
                //player
                if (otherNode && otherNode.active)
                    otherNode.getComponent(PlayerController).setDie();

            }, 1)
        } else if (name.includes(Configs.KILL_ALL_OBJ)) {
            this.isDie = true;
            this.node.getComponent(RigidBody).isStatic = true;
            if (this.animator)
                this.scheduleOnce(() => {
                    this.animator.play('Die');
                }, 0.01)
            setTimeout(() => {
                if (this.node)
                    this.node.destroy();
            }, 700);
        } else if (name.includes(Configs.KILL_HUNTER)) {
            //attack
            if (this.isAttack) return;
            this.isAttack = true;
            this.scheduleOnce(() => {
                this.animator.play('Attack');
            }, 0.01);
            this.scheduleOnce(() => {
                this.isAttack = false;
            }, 0.8)
        }
        //
    }
    physicGroup: physics.PhysicsGroup = 1;
    createRay(direction: number) {
        if (this.isDie) return;
        //console.log('Tiger Direction',direction);
        const outRay = geometry.Ray.create(this.node.worldPosition.x, this.node.worldPosition.y + 0.1, this.node.worldPosition.z, direction, 0, 0);
        if (PhysicsSystem.instance.raycastClosest(outRay, this.physicGroup, 3)) {
            let collider = PhysicsSystem.instance.raycastClosestResult.collider;
            let seeObjectName = collider.node.name;
            //console.log('Wild ray to', seeObjectName);//
            if (seeObjectName != this.node.name) {
                if (seeObjectName.includes(Configs.PLAYER_NAME) || seeObjectName.includes(Configs.KILL_HUNTER)) {
                    //move to player
                    this.isAttack = true;
                    if (this.animator)
                        this.scheduleOnce(() => {
                            this.animator.play('Attack');
                        }, 0.01)

                    let desination = collider.node.position;
                    //range to imply effect: dis from attacker to player
                    let dis: number = 0.7;
                    if (desination.x <= this.node.position.x) {

                        tween(this.node).to(0.2, { eulerAngles: new Vec3(0, -90, 0) }).start();
                    }
                    else {
                        // 90
                        tween(this.node).to(0.2, { eulerAngles: new Vec3(0, 90, 0) }).start();
                        dis = -0.8;
                    }
                    let attackPos = new Vec3(desination.x + dis, this.node.getPosition().y, desination.z);
                    tween(this.node).to(0.6, { position: attackPos }).start();
                    this.scheduleOnce(() => {

                        this.isAttack = false;
                    }, 1)
                }
                if (seeObjectName.includes('pin')) {

                    return;
                }
            }
        } else {
            //donothing
            }
    }
    timeCount: number = 0;
    //scan rating and action, scan every time unit
    scanRating: number = 1;
    update(deltaTime: number) {
        // [4]
        if (this.isAttack) return;
        this.timeCount += deltaTime;
        if (this.timeCount > this.scanRating) {
            this.createRay(1);
            this.createRay(-1);
            this.timeCount = 0;
        }
    }
}

