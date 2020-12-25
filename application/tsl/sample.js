// Module : Sample
//
// JavaScript Interface for sample.
//

/////////////////////////////////////////////////////////////////////////////

function sample ( C4
 , Sawtooth
 , Square
 ){

      let b4 = p_Press(s_C4);

     let innerCircuit = controlCircuitb4;

      c_Wave = o_Wave;

      o_Wave = WaveSwitch([c_Wave, innerCircuit[0]], [s_Square, innerCircuit[1]], [s_Sawtooth, innerCircuit[2]]);


}

/////////////////////////////////////////////////////////////////////////////

function WaveSwitch
       ( p0
       , p1
       , p2
       ){
    const r1 = p1[1] ? p1[0] : p2;[0]; 
    const r0 = p0[1] ? p0[0] : r1;
     return r0;
}


function controlCircuit
    cin0{
      w2 <- _lat_ -< cin-1

        o1 = !w2

    return [false, o1, w2];

 }

  where
    _lat_ = cell False
    _not_ = arr not


