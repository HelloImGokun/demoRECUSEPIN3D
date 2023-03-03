import { _decorator, CCBoolean, Collider, Component, geometry, physics, PhysicsSystem, RigidBody, SkeletalAnimationComponent, tween, Vec3, ITriggerEvent, Node } from 'cc';
import { Configs } from '../../utils/Configs';
import { PointNode } from '../P/PointNode';
import { PlayerController, eventTarget } from '../PlayerController';
import { Person } from '../P/Person';
import { Killer_hunter } from '../K/Killer_hunter';
const { ccclass, property } = _decorator;
@ccclass('Boar')
export class Boar extends Person {
    animator: SkeletalAnimationComponent | null = null;
    //create a raycast
    LOG_NAME = null;
    isDie: boolean = false;
    @property(PointNode)
    private attactPoint: PointNode = null;
    @property(CCBoolean)
    private needEmitToPlayer: boolean = false;
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

        if (name.includes(Configs.PLAYER_NAME)) {
            //attack
            if (this.isAttack) return;
            this.isAttack = true;
            this.animator.play('Attack');
            this.scheduleOnce(() => {
                this.isAttack=false;
                //player
                if (otherNode && otherNode.active)
                    otherNode.getComponent(PlayerController).setDie();
            }, 1)
        } else if (name.includes(Configs.KILL_HUNTER)) {
            //attack
            if (this.isAttack) return;
            this.isAttack = true;
            this.animator.play('Attack');
            this.scheduleOnce(() => {
                //
                this.isAttack=false;
                //player
                console.log('other node:', otherNode);
                if (otherNode && otherNode.active)
                    otherNode.getComponent(Killer_hunter).setDie();
            }, 1)

        } else if (name.includes(Configs.KILL_ALL_OBJ)) {
            //death
            //mo khoa cho point
            if (this.attactPoint) {
                this.attactPoint.setUnlock();
            }
            console.log(this.node.name, 'die....')
            this.isDie = true;
            this.node.getComponent(RigidBody).isStatic = true;
            if (this.animator)
                this.animator.play('Die');
            if (this.needEmitToPlayer) {
                eventTarget.emit('onListingAnimal', null);
            }
            setTimeout(() => {
                if (this.node)
                    this.node.destroy();
            }, 1000);

        }
    }

    //vision determine enemy
    isAttack: boolean = false;
    physicGroup: physics.PhysicsGroup = 1;
    createRay(direction: number) {
        if (this.isDie) return;
        //console.log('Tiger Direction',direction);
        const outRay = geometry.Ray.create(this.node.worldPosition.x, this.node.worldPosition.y + 0.1, this.node.worldPosition.z, direction, 0, 0);
        if (PhysicsSystem.instance.raycastClosest(outRay, this.physicGroup, 3)) {
            let collider = PhysicsSystem.instance.raycastClosestResult.collider;
            let seeObjectName = collider.node.name;
            console.log('Wild ray to', seeObjectName);
            if (seeObjectName != this.node.name) {
                if (seeObjectName.includes(Configs.PLAYER_NAME) || seeObjectName.includes(Configs.KILL_HUNTER)) {
                    //move to player
                    console.log('set Continue attack ray attack');
                    this.isAttack = true;
                    if (this.animator)
                        this.animator.play('Attack');
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
                    //reset
                    if (seeObjectName.includes(Configs.PLAYER_NAME) || seeObjectName.includes(Configs.KILL_HUNTER)) {
                        //game over
                    } else {
                        //restart

                    }
                    console.log('set Continue attack ray');
                    this.scheduleOnce(()=>{
                        console.log('Continue attack ray');
                        this.isAttack = false;
                    },1)

                }
                if (seeObjectName.includes('pin')) {

                    return;
                }
            }
        } else {

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

