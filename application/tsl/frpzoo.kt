// Module : Frpzoo
//
// Rxlotlin Interface for frpzoo.
//

/////////////////////////////////////////////////////////////////////////////

module Frpzoo
  ( frpzoo
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

frpzoo
data class ntuple<c, d>(val display0:c, val display10:c, val display5:c, val value0:d, val value10:d, val value5:d)


private fun frpzoo
       ( buttonEvent: a
       , toggle0: b
       , toggle10: b
       , toggle5: b
       ):ntuple<c, d>{

      val w10 = f_minusOne()
      val w11 = f_zero()
      val w12 = f_inc(c_value0)
      val w13 = f_inc(c_value10)
      val w14 = f_inc(c_value5)
      val w15 = f_setLabel(c_value0)
      val w16 = f_setLabel(c_value10)
      val w17 = f_setLabel(c_value5)
      val w18 = f_setLabel(w10)
      val b19 = p_activated(s_toggle0)
      val b20 = p_activated(s_toggle10)
      val b21 = p_activated(s_toggle5)
      val b22 = p_clicked0(s_buttonEvent)
      val b23 = p_clicked10(s_buttonEvent)
      val b24 = p_clicked5(s_buttonEvent)

    val cout = controlCircuit(b24, b23, b22, b21, b20, b19)

      c_display0 = o_display0
      c_display10 = o_display10
      c_display5 = o_display5
      c_value0 = o_value0
      c_value10 = o_value10
      c_value5 = o_value5

      val o_display0 = display0Switch(Pair(w18, cout[13]), Pair(w15, cout[14]), Pair(c_display0, cout[15]))

      val o_display10 = display10Switch(Pair(w18, cout[10]), Pair(w16, cout[11]), Pair(c_display10, cout[12]))

      val o_display5 = display5Switch(Pair(w18, cout[7]), Pair(w17, cout[8]), Pair(c_display5, cout[9]))

      val o_value0 = value0Switch(Pair(w12, cout[4]), Pair(w11, cout[5]), Pair(c_value0, cout[6]))

      val o_value10 = value10Switch(Pair(w13, cout[2]), Pair(c_value10, cout[3]))

      val o_value5 = value5Switch(Pair(w14, cout[0]), Pair(c_value5, cout[1]))

    return ntuple(o_display0, o_display10, o_display5, o_value0, o_value10, o_value5)
}

+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
private fun <T>display0Switch
       ( p0: Pair<T,Boolean>
       , p1: Pair<T,Boolean>
       , p2: Pair<T,Boolean>
       ):T{
    val r1 = if (p1.second) p1first else p2.first 
    val r0 = if (p0.second) p0first else r1
     return r0
}

private fun <T>display10Switch
       ( p0: Pair<T,Boolean>
       , p1: Pair<T,Boolean>
       , p2: Pair<T,Boolean>
       ):T{
    val r1 = if (p1.second) p1first else p2.first 
    val r0 = if (p0.second) p0first else r1
     return r0
}

private fun <T>display5Switch
       ( p0: Pair<T,Boolean>
       , p1: Pair<T,Boolean>
       , p2: Pair<T,Boolean>
       ):T{
    val r1 = if (p1.second) p1first else p2.first 
    val r0 = if (p0.second) p0first else r1
     return r0
}

private fun <T>value0Switch
       ( p0: Pair<T,Boolean>
       , p1: Pair<T,Boolean>
       , p2: Pair<T,Boolean>
       ):T{
    val r1 = if (p1.second) p1first else p2.first 
    val r0 = if (p0.second) p0first else r1
     return r0
}

private fun <T>value10Switch
       ( p0: Pair<T,Boolean>
       , p1: Pair<T,Boolean>
       ):T{
    val r0 = if (p0.second) p0first else p1.first 
    return r0
}

private fun <T>value5Switch
       ( p0: Pair<T,Boolean>
       , p1: Pair<T,Boolean>
       ):T{
    val r0 = if (p0.second) p0first else p1.first 
    return r0
}


private fun controlCircuit
    ( cin0: Boolean
    , cin1: Boolean
    , cin2: Boolean
    , cin3: Boolean
    , cin4: Boolean
    , cin5: Boolean
    ): Array<Boolean>{

        w7 = !cin3 && cin0
        w8 = !cin5 && cin2
        w9 = !cin5 && !cin2
        o1 = !w7
        o3 = !cin1
        o8 = !cin3
        o11 = !cin4
        o14 = !cin5

    return arrayOf(w7, o1, cin1, o3, w8, cin5, w9, cin3, o8, false, cin4, o11, false, cin5, o14, false)

 }

  where
    _not_ = arr not

=============================================================================
