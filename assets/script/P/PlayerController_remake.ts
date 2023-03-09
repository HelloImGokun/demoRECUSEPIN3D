import { _decorator, Component, EventTarget, instantiate, ITriggerEvent, math, Node, RigidBody, SkeletalAnimationComponent, Tween, tween, Vec3 } from 'cc';
import { Person } from './Person';
import { LevelController } from '../controller/LevelController';
import { PathList } from './PathList';
import { PointNode } from './PointNode';
import { PointType } from '../Enum/PointType';
import { Configs } from '../../utils/Configs';
import { Water } from '../W/Water';
import { Door } from '../D/Door';
const { ccclass, property } = _decorator;
//emit event
export const eventTarget = new EventTarget();
//
@ccclass('PlayerController_remake')
export class PlayerController_remake extends Person {
    private isFindDoor: boolean = false;
    private levelController: LevelController;
    //check xem player da die or win

    //duong di duoc lua chon
    private selectedPath: PathList = null
    //index cua duong di
    private pointCount: number = 0;
    //check xem player co dang tim duong hay khong
    private isFindingPath: boolean = false;

    protected onLoad(): void {
        eventTarget.on('onListingAnimal', (data) => {
            //lang nghe su kien boar die  // print 1, 2, 3
            this.findPath();
        })
    }
    start() {
        this.collider.on('onTriggerEnter', this.onTriggerEnter, this);
        this.collider.on('onTriggerExit', this.onTriggerExit, this);
        this.collider.on('onTriggerStay', this.onTriggerStay, this);
        //get LevelController
        this.levelController = this.node.parent.getComponent(LevelController);
        //
        this.animator = this.node.getComponent(SkeletalAnimationComponent);
        this.playJump();
        this.findPath();

    }
    //

    //
    public findPath() {
        //lap qua path list de tim duong
        //
        if (this.isOver) return;
        //neu dang tim duong roi thi khong check tiep
        if (this.isFindingPath) return;
        //neu dang tim duong roi thi check tiep

        //
        let pathList = this.levelController.getPathList();
        //loop qua toan bo cac duong di
        for (let i = 0; i < pathList.length; i++) {
            //lay ra 1 duong di va check xem co the di duoc hay khong
            let pList: PathList = pathList[i];
            if (pList && this.isPointUnlock(pList)) {
                this.selectedPath = pList;
                this.isFindingPath = true;
                return this.followPath();
            } else {

                this.isFindingPath = false;
            }
        }

    }

    private isPointUnlock(pointList: PathList) {
        //check 1st point of path
        if (!pointList.getPointList()[0].getIsLock()) {
            return true;
        }
        return false;
    }
    private followPath() {
        //check path 0
        this.checkPoint();
    }
    private checkPoint() {
        this.checkPointAndMove(this.selectedPath.getPointList()[this.pointCount]);
    }
    // z luon bang 0
    private convertPositionToPlayerY(playerPos, pointPos) {
        return new Vec3(pointPos.x, playerPos.y, 0);
    }
    //
    private checkPointAndMove(pointNode: PointNode) {
        if (pointNode == null) {
            //end of way
            //khi khong tim duoc duong thi set lai

            this.isFindingPath = false
            //reset lai point
            this.pointCount = 0;
            return;
        }
        //point dang lock
        if (pointNode.getIsLock()) {
            this.isFindingPath = false
            return;
        };
        if (this.isOver) return;
        //
        let pointType = pointNode.getPointType();
        switch (pointNode.getPointType()) {
            case PointType.walk:
                let desinationPoint: Vec3 = this.convertPositionToPlayerY(this.node.position, pointNode.getPosition())
                //play animation run 
            // pointNode.getAnimimation();
                this.animator.play('run')
                this.Move(pointNode, desinationPoint, () => {
                    this.pointCount++;
                    this.checkPoint();
                });
                break;
            case PointType.jump:
                this.jumpToPoint(pointNode, () => {
                    this.pointCount++;
                    this.checkPoint();
                })
                break;
            case PointType.fall:
                //set animation jump
                this.scheduleOnce(() => {
                    //cho cho den khi roi xuong dat
                    this.pointCount++;
                    this.checkPoint();
                }, pointNode.getMovingTime());
                break;
            case PointType.climb:
                this.climb(pointNode, () => {
                    this.pointCount++;
                    this.checkPoint();
                })

                break;
            case PointType.teleout:
                this.teleout(pointNode, () => {
                    this.pointCount++;
                    this.checkPoint();
                })
                break;
            case PointType.telein:
                this.teleIn(pointNode, () => {
                    this.pointCount++;
                    this.checkPoint();
                })
            case PointType.swimL:
                break;
        }
    }
    private teleIn(pointNode: PointNode, callback: () => void) {
        this.node.setPosition(pointNode.getPosition());
        tween(this.node).sequence(
            tween(this.node).call(() => {
                //chuyen = static
                this.rigidBody.isStatic = true;
                this.node.setRotationFromEuler(new Vec3(0, 0, 0));
            }),
            tween(this.node).by(0.5, { position: new Vec3(0, -0.5, 0) }),
            tween(this.node).call(() => {
                callback();
            })
        ).start();
    }
    private teleout(pointNode: PointNode, callback) {
        this.node.setPosition(pointNode.getPosition());
        tween(this.node).sequence(
            //di len
            tween(this.node).by(0.5, { position: new Vec3(0, 0.5, 0) }),
            tween(this.node).call(() => {
                //chuyen = dynamic
                this.rigidBody.isDynamic = true;
            }),
            tween(this.node).call(() => {
                this.scheduleOnce(() => {
                    callback();
                }, pointNode.getDelayTime());
            })
        ).start();
    }
    private jumpToPoint(point: PointNode, finishCallback) {
        //
        //set state
       //this.animator.play('midair');
        //add force
        this.rigidBody.clearForces();
        this.Jump(point.getJumpForce())
        this.isJumping = true;
        this.scheduleOnce(() => {
            finishCallback();
            this.isJumping = false;
        }, point.getMovingTime());
    }
    //
   
    private attachFloat(float: Node) {
        //remove float cu va tao 1 float moi gan vao player (de loai bo rigidbody,collider..)
        let newFloat = instantiate(float.getChildByName('float'));
        this.neckNode.addChild(newFloat);

        newFloat.setPosition(new math.Vec3(0, 0, 0));
        newFloat.setRotationFromEuler(new math.Vec3(0, 90, 0));
        //huy float cu
        float.destroy();
    }
    public getIsFloat() {
        return this.isFloat;
    }
    private onTriggerExit(event: ITriggerEvent) {
        //check xem player da thoat khoi mat dat chua
        //
        if (this.isOver) return;
        if (event.otherCollider.name.includes(Configs.FLOOR_GROUND_NAME) || event.otherCollider.name.includes(Configs.WATER_COLLIDER_NAME)) {
            //player roi tu do
          
            //this.playJump()
        }
        // if (event.otherCollider.name.includes('pin')) {
        //     //player roi tu do
        //     this.playRun();
        // }
    }
    private onTriggerStay(event: ITriggerEvent) {
        if (this.isOver) return;

        if (event.otherCollider.name.includes(Configs.FLOOR_GROUND_NAME)) {
            //this.playRun();
            
        }
        if (event.otherCollider.name.includes(Configs.WATER_COLLIDER_NAME) && this.isFloat) {
            //if is jump return: Neu dang jump thi khong set y

            if (!this.isJumping) {
                let yPos = event.otherCollider.node.getParent().getComponent(Water).getWaterFloatY();
                //this.rigidBody.useGravity=false;
                this.node.setPosition(new math.Vec3(this.node.position.x, yPos, this.node.position.z));
            }
        }
    }
    //
    isRun:boolean = false;
    //check touch door
    private onTriggerEnter(event: ITriggerEvent) {
        //


        if (this.isOver) return;
        //
        let collisionNode: Node = event.otherCollider.node;

        //check player dat chan xuong mat dat hay chua
        if (collisionNode.name.includes(Configs.FLOOR_GROUND_NAME)) {
            //player roi xuong mat dat
            //this.playIdle();
        }
        else{
            //th khac cho ve run
           // this.playRun();
        }
        if (collisionNode.name.includes(Configs.WATER_COLLIDER_NAME)) {
            //neu co phao => chuyen sang animation swim
            if (this.isFloat) {
                //this.playSwim();
            } else {
                //die
                this.scheduleOnce(() => {
                    this.setDie();
                }, 1)

            }

        }
        if (!this.isFindDoor) {
            //1. check door
            if (collisionNode.name.includes(Configs.DOOR_NAME)) {
                this.findDoor(collisionNode);
            }
            //cham vao enemy la die
            else if (collisionNode.name.includes(Configs.KILL_ALL_OBJ) || collisionNode.name.includes(Configs.KILL_HUNTER)) {
                this.setDie();
            }
        }
        //bring float
        if (collisionNode.name.includes(Configs.FLOAT_NAME)) {
            if (this.isFloat) return;
            this.isFloat = true;
            if (collisionNode.getComponent(RigidBody)) {
                //collisionNode.getComponent(RigidBody).isStatic=true;
                this.attachFloat(collisionNode);

            }

        }
    }
    //
    private findDoor(doorNode: Node) {
        if (this.isFindDoor) return;
        this.isFindDoor = true;
        //
        const simpleDoor = () => {
            //
            let doorPosition: Vec3 = null;
            tween(this.node).sequence(
                tween(this.node).call(() => {
                    //open door
                    doorNode.getComponent(Door).openDoor();
                }),
                //xoay nguoi lai huong door
                tween(this.node).call(() => {
                    doorPosition = new math.Vec3(doorNode.position.x + 0.3, this.node.position.y, this.node.position.z);
                }),
                tween(this.node).to(0.1, { position: doorPosition }),
                tween(this.node).delay(0.5),
                tween(this.node).to(0.2, { eulerAngles: new Vec3(0, 180, 0) }),

                tween(this.node).by(0.7, { position: new Vec3(0, 0, -0.4) }),

                tween(this.node).delay(0.5),
                //xoay nguoi huong ra ngoai 
                tween(this.node).to(0.2, { eulerAngles: new Vec3(0, 0, 0) }),
                tween(this.node).call(() => {
                    //do win animation;
                    //this.playVictory();

                }),
                tween(this.node).delay(1),
                tween(this.node).call(() => {
                    this.openDoorSuccess();
                })
            ).start();
            //
        }
        const npcDoor = () => {
            //npc point 
            let standPoint = doorNode.getComponent(Door).getStandPoint();
            tween(this.node).sequence(
                tween(this.node).call(() => {
                    //open door
                    doorNode.getComponent(Door).openDoor();
                }),
                //xoay nguoi lai huong door
                tween(this.node).delay(0.5),
                tween(this.node).to(0.2, { eulerAngles: new Vec3(0, 180, 0) }),
                tween(this.node).by(0.7, { position: new Vec3(0, 0, -0.4) }),

                tween(this.node).delay(0.5),
                //nhay vao ben trong va xoay doi dien voi npc
                tween(this.node).to(0.2, { position: standPoint }),
                tween(this.node).to(0.2, { eulerAngles: new Vec3(0, -90, 0) }),
                tween(this.node).call(() => {
                    //do win animation;
                    //this.playVictory();
                    //npc wave
                    doorNode.getComponent(Door).rescueNPC();
                }),
                tween(this.node).delay(1),
                tween(this.node).call(() => {
                    this.openDoorSuccess();
                })


            ).start();
        }
        //
        //door npc
        if (doorNode.getComponent(Door).getIsNPC()) {
            //npc
            npcDoor();
        } else {
            //door thuong
            simpleDoor();
        }
    }
    private openDoorSuccess() {
        //win
        //get level manager
        let LevelControllerNode = this.node.getParent();
        if (LevelControllerNode.getComponent(LevelController)) {
            LevelControllerNode.getComponent(LevelController).winLevel();
        }

    }
    update(deltaTime: number) {
        //check run
        this.checkRun();

        //
    }
    private checkRun() {
        let deltaX;
        let deltaZ;
        if (this.oldX == null) {
            this.oldX = this.node.position.x;
        } else {
            this.newX = this.node.position.x;
            deltaX = this.newX - this.oldX
            if(Math.abs(deltaX)>0.001){
                this.playRun();
            }
            //check left or right
            this.checkMoveLeftOrRight(deltaX);

            this.oldX = this.newX;
        }

        if (this.oldZ == null) {
            this.oldZ = this.node.position.z;
        } else {
            this.newZ = this.node.position.z;
            deltaZ = this.newZ - this.oldZ
           
            if(Math.abs(deltaZ)>0.001){
                this.playRun();
            }
            this.oldZ = this.newZ;
        }
        if(Math.abs(deltaX)<0.001 && Math.abs(deltaZ)<0.001&&this.notJump()&&this.notSwim()){
            this.playIdle();
        }
        
    }
    private checkMoveLeftOrRight(deltaX) {
        if (!this.rigidBody.isStatic) {
            if (deltaX > 0.001) {
                //move right
                this.node.setRotationFromEuler(new Vec3(0, 90, 0));
            } else if (deltaX < -0.001) {
                //move left
                this.node.setRotationFromEuler(new Vec3(0, -90, 0));
            }
        }

    }
    setDie() {
        
        this.isOver = true;
        //stop all tween
        //
        Tween.stopAllByTarget(this.node);
        //
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 2);
        //
        //delay for a second
        this.scheduleOnce(() => {
            //lose game
            let LevelControllerNode = this.node.getParent();
            if (LevelControllerNode.getComponent(LevelController)) {
                LevelControllerNode.getComponent(LevelController).loseGame();
            }
        }, 1)
    }

}
