// Module : Toy-spec
//
// Rxlotlin Interface for toy-spec.
//

/////////////////////////////////////////////////////////////////////////////

module Toy-spec
  ( toy-spec
  ) where

/////////////////////////////////////////////////////////////////////////////

import Control.Arrow
  ( Arrow
  , ArrowLoop
  , returnA
  , arr
  , (<<<)
  )

-----------------------------------------------------------------------------

toy-spec
data class ntupleb(val audio:b, val trackA:b, val trackB:b, val trackC:b)


private fun toy-spec
       ( buttonA: a
       , buttonB: a
       ):ntupleb{

      val w6 = f_play()
      val w7 = f_stop()
      val b8 = p_press(s_buttonA)
      val b9 = p_press(s_buttonB)

    val cout = controlCircuit(b9, b8)

      c_audio = o_audio
      c_trackA = o_trackA
      c_trackB = o_trackB
      c_trackC = o_trackC

      val o_audio = audioSwitch(Pair(w7, cout[7]), Pair(w6, cout[8]), Pair(c_audio, cout[9]))

      val o_trackA = trackASwitch(Pair(w6, cout[5]), Pair(c_trackA, cout[6]))

      val o_trackB = trackBSwitch(Pair(w7, cout[2]), Pair(w6, cout[3]), Pair(c_trackB, cout[4]))

      val o_trackC = trackCSwitch(Pair(w6, cout[0]), Pair(c_trackC, cout[1]))

    return ntuple(o_audio, o_trackA, o_trackB, o_trackC)
}

+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
private fun <T>audioSwitch
       ( p0: Pair<T,Boolean>
       , p1: Pair<T,Boolean>
       , p2: Pair<T,Boolean>
       ):T{
    val r1 = if (p1.second) p1first else p2.first 
    val r0 = if (p0.second) p0first else r1
     return r0
}

private fun <T>trackASwitch
       ( p0: Pair<T,Boolean>
       , p1: Pair<T,Boolean>
       ):T{
    val r0 = if (p0.second) p0first else p1.first 
    return r0
}

private fun <T>trackBSwitch
       ( p0: Pair<T,Boolean>
       , p1: Pair<T,Boolean>
       , p2: Pair<T,Boolean>
       ):T{
    val r1 = if (p1.second) p1first else p2.first 
    val r0 = if (p0.second) p0first else r1
     return r0
}

private fun <T>trackCSwitch
       ( p0: Pair<T,Boolean>
       , p1: Pair<T,Boolean>
       ):T{
    val r0 = if (p0.second) p0first else p1.first 
    return r0
}


private fun controlCircuit
    ( cin0: Boolean
    , cin1: Boolean
    ): Array<Boolean>{


    return arrayOf(true, false, false, false, true, true, false, false, false, true)

 }

=============================================================================
