import { _decorator, Component, Node, animation } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerAnnGraph")
export class PlayerAnnGraph extends animation.StateMachineComponent {
    
    /**
     * Called right after a motion state is entered.
     * @param controller The animation controller it within.
     * @param motionStateStatus The status of the motion.
     */
    public onMotionStateEnter (controller: animation.AnimationController, motionStateStatus: Readonly<animation.MotionStateStatus>): void {
        // Can be overrode
        console.log('1',motionStateStatus);

    }

    /**
     * Called when a motion state is about to exit.
     * @param controller The animation controller it within.
     * @param motionStateStatus The status of the motion.
     */
    public onMotionStateExit (controller: animation.AnimationController, motionStateStatus: Readonly<animation.MotionStateStatus>): void {
        // Can be overrode
        console.log('2',motionStateStatus);
    }

    /**
     * Called when a motion state updated except for the first and last frame.
     * @param controller The animation controller it within.
     * @param motionStateStatus The status of the motion.
     */
    public onMotionStateUpdate (controller: animation.AnimationController, motionStateStatus: Readonly<animation.MotionStateStatus>): void {
        // Can be overrode
    }

    /**
     * Called right after a state machine is entered.
     * @param controller The animation controller it within.
     */
    public onStateMachineEnter (controller: animation.AnimationController) {
        // Can be overrode
        console.log('3');
    }

    /**
     * Called right after a state machine is entered.
     * @param controller The animation controller it within.
     */
    public onStateMachineExit (controller: animation.AnimationController) {
        // Can be overrode
        console.log('4');
    }
    
}
