// Module : Toy-spec
//
// JavaScript Interface for toy-spec.
//

/////////////////////////////////////////////////////////////////////////////

function toy-spec ( buttonA
 , buttonB
 ){

      let w6 = f_play()
      let w7 = f_stop()
      let b8 = p_press(s_buttonA)
      let b9 = p_press(s_buttonB)

     let innerCircuit = controlCircuit(b9, b8)

      c_audio = o_audio
      c_trackA = o_trackA
      c_trackB = o_trackB
      c_trackC = o_trackC

      o_audio = audioSwitch([w7, innerCircuit[8]], [w6, innerCircuit[9]], [c_audio, innerCircuit[10]])

      o_trackA = trackASwitch([w6, innerCircuit[6]], [c_trackA, innerCircuit[7]])

      o_trackB = trackBSwitch([w7, innerCircuit[3]], [w6, innerCircuit[4]], [c_trackB, innerCircuit[5]])

      o_trackC = trackCSwitch([w7, innerCircuit[0]], [w6, innerCircuit[1]], [c_trackC, innerCircuit[2]])


}

/////////////////////////////////////////////////////////////////////////////

function audioSwitch
       ( p0
       , p1
       , p2
       ){
    const r1 = p1[1] ? p1[0] : p2;[0]; 
    const r0 = p0[1] ? p0[0] : r1;
     return r0;
}

function trackASwitch
       ( p0
       , p1
       ){
    const r0 = p0[1] ? p0[0] : p1;[0]; 
    return r0;
}

function trackBSwitch
       ( p0
       , p1
       , p2
       ){
    const r1 = p1[1] ? p1[0] : p2;[0]; 
    const r0 = p0[1] ? p0[0] : r1;
     return r0;
}

function trackCSwitch
       ( p0
       , p1
       , p2
       ){
    const r1 = p1[1] ? p1[0] : p2;[0]; 
    const r0 = p0[1] ? p0[0] : r1;
     return r0;
}


private fun controlCircuit
    ( cin0: Boolean
    , cin1: Boolean
    ): Array<Boolean>{
      w3 <- _lat_ <<< _not_ -< w3
      w4 <- _lat_ -< w5

        w5 = !w4 && w3
        w6 = w4 && w3
        o0 = !w3
        o4 = !w3
        o6 = !w6
        o9 = !w3

    return arrayOf(o0, w5, false, w5, o4, false, o6, false, w5, o9, false)

 }

  where
    _lat_ = cell False
    _not_ = arr not


