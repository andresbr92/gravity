var Example = Example || {};


    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Composites = Matter.Composites,
        Common = Matter.Common,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        World = Matter.World,
        Bodies = Matter.Bodies;

    // create engine
    var engine = Engine.create(),
        world = engine.world;
    //lenght and with
    

    // create renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.visualViewport.width,
            height: window.visualViewport.height,
            showAngleIndicator: true
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies
    var stack = Composites.stack(20, 20, 10, 5, 0, 0, function(x, y) {
        var sides = Math.round(Common.random(1, 8));

        // triangles can be a little unstable, so avoid until fixed
        sides = (sides === 3) ? 4 : sides;

        // round the edges of some bodies
        var chamfer = null;
        if (sides > 2 && Common.random() > 0.7) {
            chamfer = {
                radius: 10
            };
        }

        switch (Math.round(Common.random(0, 1))) {
        case 0:
            if (Common.random() < 0.8) {
                return Bodies.rectangle(x, y, Common.random(25, 50), Common.random(25, 50), { chamfer: chamfer });
            } else {
                return Bodies.rectangle(x, y, Common.random(80, 120), Common.random(25, 30), { chamfer: chamfer });
            }
        case 1:
            return Bodies.polygon(x, y, sides, Common.random(25, 50), { chamfer: chamfer });
        }
    });


    World.add(world, [
        Bodies.rectangle(0, 0, window.visualViewport.width*2, 20, { isStatic: true }),
        Bodies.rectangle(0, 0, 20, window.visualViewport.height*2, { isStatic: true }),
        Bodies.rectangle(window.visualViewport.width, window.visualViewport.height/2, 20, window.visualViewport.height, { isStatic: true }),
        
        Bodies.rectangle(0, window.visualViewport.height, window.visualViewport.width*2, 20, { isStatic: true }),
        
        stack,
        
        
    ]);
   
    

    // add gyro control
    if (typeof window !== 'undefined') {
        var updateGravity = function(event) {
            var orientation = typeof window.orientation !== 'undefined' ? window.orientation : 0,
                gravity = engine.world.gravity;

            if (orientation === 0) {
                gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
                gravity.y = Common.clamp(event.beta, -90, 90) / 90;
            } else if (orientation === 180) {
                gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
                gravity.y = Common.clamp(-event.beta, -90, 90) / 90;
            } else if (orientation === 90) {
                gravity.x = Common.clamp(event.beta, -90, 90) / 90;
                gravity.y = Common.clamp(-event.gamma, -90, 90) / 90;
            } else if (orientation === -90) {
                gravity.x = Common.clamp(-event.beta, -90, 90) / 90;
                gravity.y = Common.clamp(event.gamma, -90, 90) / 90;
            }
        };

        window.addEventListener('deviceorientation', updateGravity);
    }

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: window.visualViewport.width, y: window.visualViewport.height }
    });

    // context for MatterTools.Demo
    // return {
    //     engine: engine,
    //     runner: runner,
    //     render: render,
    //     canvas: render.canvas,
    //     stop: function() {
    //         Matter.Render.stop(render);
    //         Matter.Runner.stop(runner);
    //         if (typeof window !== 'undefined') {
    //             window.removeEventListener('deviceorientation', updateGravity);
    //         }
    //     }
    // };


if (typeof module !== 'undefined') {
    module.exports = Example[Object.keys(Example)[0]];
}