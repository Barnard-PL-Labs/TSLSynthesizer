data class ntupleb(val audio:b, val trackA:b, val trackB:b, val trackC:b)

private fun toy-spec
       ( buttonA: a
       , buttonB: a
       , play: b
       , stop: b
       ):ntupleb{

      val b8 = p_press(s_buttonA)
      val b9 = p_press(s_buttonB)

    val cout = controlCircuit(b9, b8)

      c_audio = o_audio
      c_trackA = o_trackA
      c_trackB = o_trackB
      c_trackC = o_trackC

      val o_audio = audioSwitch(Pair(s_stop, cout[7]), Pair(s_play, cout[8]), Pair(c_audio, cout[9]))

      val o_trackA = trackASwitch(Pair(c_trackA, cout[5]), Pair(s_play, cout[6]))

      val o_trackB = trackBSwitch(Pair(c_trackB, cout[2]), Pair(s_stop, cout[3]), Pair(s_play, cout[4]))

      val o_trackC = trackCSwitch(Pair(c_trackC, cout[0]), Pair(s_play, cout[1]))

    return ntuple(o_audio, o_trackA, o_trackB, o_trackC)
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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


    return arrayOf(false, true, true, false, false, true, false, false, false, true)

 }
