import { _decorator, Collider, Component, geometry, ICollisionEvent, Node, physics, PhysicsSystem, RigidBody, SkeletalAnimationComponent, tween, Vec3 } from 'cc';
import { Configs } from '../../utils/Configs';
const { ccclass, property } = _decorator;

@ccclass('Killer_hunter')
export class Killer_hunter extends Component {
    killerAnimator: SkeletalAnimationComponent | null = null;
    //create raycast
    LOG_NAME = null;
    //
    isDie: boolean = false;
    start() {
        this.LOG_NAME = this.node.name;
        this.killerAnimator = this.getComponent(SkeletalAnimationComponent);
        this.killerAnimator.play('idle');
        let collider = this.getComponent(Collider)
        collider.on('onCollisionEnter', this.onCollisionEnter, this);
    }
    private onCollisionEnter(event: ICollisionEvent) {
        let name = event.otherCollider.node.name;
        if (name.includes(Configs.PLAYER_NAME) || name.includes(Configs.KILL_PLAYER_OBJ)) {
            //attack
            if (this.killerAnimator)
                this.killerAnimator.play('Attack');
        } else if (name.includes(Configs.KILL_ALL_OBJ)) {
            //death
            console.log(this.node.name, 'die....')
            this.isDie = true;
            this.node.getComponent(RigidBody).isStatic = true;
            if (this.killerAnimator)
                this.killerAnimator.play('Die');
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
            //console.log('Wild ray to',seeObjectName);
            if (seeObjectName != this.node.name) {
                if (seeObjectName.includes(Configs.PLAYER_NAME) || seeObjectName.includes(Configs.KILL_PLAYER_OBJ)) {
                    //move to player
                    this.isAttack = true;
                    if (this.killerAnimator)
                        this.killerAnimator.play('Attack');
                    let desination = collider.node.position;
                    //range to imply effect: dis from attacker to player
                    let range: number = 0.7;
                    if (desination.x > this.node.position.x) {
                        if (this.node.eulerAngles.y < -80) {
                            //-90; rotate
                            tween(this.node).by(0.2, { eulerAngles: new Vec3(0, -180, 0) }).start();

                        } else {
                            //do nothing

                        }

                        range = -0.7;
                    } else {
                        if (this.node.eulerAngles.y < -80) {
                            //-90 rotate
                            //do nothing

                        } else {
                            tween(this.node).by(0.2, { eulerAngles: new Vec3(0, 180, 0) }).start();

                        }
                        this.killerAnimator.play('run');
                    }
                    let attackPos = new Vec3(desination.x + range, desination.y, desination.z);
                    tween(this.node).to(0.5, { position: attackPos }).start();
                    //reset
                    if (seeObjectName.includes(Configs.PLAYER_NAME) || seeObjectName.includes(Configs.KILL_PLAYER_OBJ)) {
                        //game over
                    } else {
                        //restart

                    }
                    setTimeout(() => {
                        this.isAttack = false;
                    }, 1000);

                }
                if (seeObjectName.includes(Configs.PIN_NAME)) {

                    return;
                }
            }
        } else {
            console.log('failed');
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


