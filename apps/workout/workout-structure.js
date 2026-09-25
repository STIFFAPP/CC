const WORKOUT_GROUP_COLORS = [
  [
    ["yellow","yellow","white","green","green","yellow","yellow","green","green"],
    ["white","yellow","yellow","green","green","yellow","yellow"],
    ["white","yellow","yellow","green","green","yellow","yellow","white"],
    ["white","white","yellow","yellow","green","green","yellow","yellow","green","green","green"],
    ["white","yellow","yellow","green","green","yellow","yellow"],
    ["white","yellow","yellow","green","green","white"]
  ],
  [
    ["white","yellow","yellow","green","green","yellow","yellow"],
    ["yellow","yellow","green","green","yellow","yellow","white","green","green"],
    ["white","green","green","yellow","yellow","green","green","yellow","yellow"],
    ["white","yellow","yellow","white","green","green","green","yellow","yellow","green","green","green"],
    ["white","yellow","yellow","green","green"],
    ["white","yellow","yellow","green","green","yellow","yellow"]
  ],
  [
    ["white","yellow","yellow","green","green","yellow","yellow","green","green","yellow","yellow","yellow","yellow","white"],
    ["white","yellow","yellow","green","green","white","yellow","yellow","green","green"],
    ["white","white","white","yellow","yellow","white"],
    ["yellow","yellow","green","green","yellow","yellow"],
    ["white","yellow","yellow","green","green","white"],
    ["white","yellow","yellow","green","green","yellow","yellow","green","green","yellow","yellow","yellow","yellow"]
  ],
  [
    ["white","yellow","yellow","green","green","yellow","yellow","white","green","green"],
    ["white","yellow","yellow","green","green","yellow","yellow"],
    ["yellow","yellow","green","green","yellow","yellow","white"],
    ["white","yellow","yellow","green","green","yellow","yellow","white"],
    ["white","green","green","yellow","yellow","white","white"],
    ["white","yellow","yellow","green","green","yellow","yellow","green","green"]
  ]
];

window.WORKOUT_DATA.phases.forEach((phase, phaseIndex) => {
  phase.days.forEach((day, dayIndex) => {
    const colors = WORKOUT_GROUP_COLORS[phaseIndex][dayIndex];
    let groupNumber = 0;
    let previousColor = "white";
    day.exercises.forEach((exercise, exerciseIndex) => {
      const color = colors[exerciseIndex] || "white";
      if (color === "white") {
        exercise.groupColor = "white";
        exercise.groupId = null;
      } else {
        if (color !== previousColor) groupNumber += 1;
        exercise.groupColor = "green-red";
        exercise.groupId = `${phaseIndex}-${dayIndex}-${groupNumber}`;
      }
      previousColor = color;
    });
  });
});

const TUESDAY_ABS = [
  {id:"after-tue-leg-raise",name:"Leg Raise",sets:4,reps:"10",repTargets:["10","10","10","10"],trackWeight:false},
  {id:"after-tue-crucifix",name:"Crusafix Diagnal Sit-up",sets:4,reps:"10",repTargets:["10","10","10","10"],trackWeight:false},
  {id:"after-tue-twisting",name:"Twisting Bleets",sets:4,reps:"10",repTargets:["10","10","10","10"],trackWeight:false},
  {id:"after-tue-wheel",name:"Abs wheel",sets:4,reps:"10",repTargets:["10","10","10","10"],trackWeight:false}
];

const THURSDAY_ABS = [
  {id:"after-thu-bicycle",name:"Bicycle Crunches",sets:3,reps:"20",repTargets:["20","20","20"],trackWeight:false},
  {id:"after-thu-flutter",name:"Flutter Kicks",sets:3,reps:"30",repTargets:["30","30","30"],trackWeight:false},
  {id:"after-thu-scissors",name:"Scissors",sets:3,reps:"30",repTargets:["30","30","30"],trackWeight:false},
  {id:"after-thu-knee-twist",name:"Elevated Knee-In Twist",sets:3,reps:"20 each side",repTargets:["20 each side","20 each side","20 each side"],trackWeight:false},
  {id:"after-thu-plank",name:"Plank",sets:3,reps:"1 minute",repTargets:["1 minute","1 minute","1 minute"],repUnit:"",trackWeight:false},
  {id:"after-thu-side-plank",name:"Side Plank",sets:3,reps:"1 minute each side",repTargets:["1 minute each side","1 minute each side","1 minute each side"],repUnit:"",trackWeight:false}
];

const WEDNESDAY_STRETCHES = [
  {id:"after-wed-cat",name:"Cat Stretch",sets:1,reps:"45 seconds",repTargets:["45 seconds"],repUnit:"",trackWeight:false},
  {id:"after-wed-world",name:"World's Greatest Stretch",sets:1,reps:"45 seconds each side",repTargets:["45 seconds each side"],repUnit:"",trackWeight:false},
  {id:"after-wed-chest",name:"Chest And Front Of Shoulder Stretch",sets:1,reps:"45 seconds",repTargets:["45 seconds"],repUnit:"",trackWeight:false},
  {id:"after-wed-upper",name:"Upper Back Stretch",sets:1,reps:"45 seconds",repTargets:["45 seconds"],repUnit:"",trackWeight:false},
  {id:"after-wed-hip",name:"Intermediate Hip Flexor and Quad Stretch",sets:1,reps:"45 seconds each side",repTargets:["45 seconds each side"],repUnit:"",trackWeight:false},
  {id:"after-wed-hamstring",name:"Hamstring Stretch",sets:1,reps:"45 seconds each side",repTargets:["45 seconds each side"],repUnit:"",trackWeight:false},
  {id:"after-wed-glute",name:"IT Band and Glute Stretch",sets:1,reps:"45 seconds each side",repTargets:["45 seconds each side"],repUnit:"",trackWeight:false},
  {id:"after-wed-calf",name:"Standing Hamstring and Calf Stretch",sets:1,reps:"45 seconds each side",repTargets:["45 seconds each side"],repUnit:"",trackWeight:false}
];

window.WORKOUT_ACCESSORIES = {
  Monday: {position:"before",type:"hiit",title:"HIIT Cardio",description:"20 minutes. Alternate 1 minute jogging with 1 minute running for 10 rounds."},
  Tuesday: {position:"after",type:"exercises",title:"Abs",description:"Complete these four core exercises after the final workout exercise.",exercises:TUESDAY_ABS},
  Wednesday: {position:"after",type:"exercises",title:"Long Stretch",description:"Move slowly through each stretch after training. Hold a comfortable position and do not bounce.",exercises:WEDNESDAY_STRETCHES},
  Thursday: {position:"after",type:"exercises",title:"Abs",description:"Complete this core session after the final workout exercise.",exercises:THURSDAY_ABS},
  Friday: {position:"before",type:"hiit",title:"HIIT Cardio",description:"20 minutes. Alternate 1 minute jogging with 1 minute running for 10 rounds."},
  Saturday: {position:"after",type:"exercises",title:"Abs",description:"Complete these four core exercises after the final workout exercise.",exercises:TUESDAY_ABS.map(item=>({...item,id:item.id.replace("tue","sat")}))}
};
