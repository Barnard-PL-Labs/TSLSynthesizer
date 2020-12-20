-----------------------------------------------------------------------------
-- |
-- Module : Toy-spec
--
-- Applicative Interface for toy-spec.
--
-----------------------------------------------------------------------------

{-# LANGUAGE Rank2Types, RecursiveDo #-}

-----------------------------------------------------------------------------

module Toy-spec
  ( toy-spec
  ) where

-----------------------------------------------------------------------------

import Control.Monad.Fix
  ( MonadFix
  )

-----------------------------------------------------------------------------

toy-spec
  :: (MonadFix m, Applicative signal)
     -- cell implementation
  => (forall poly. poly -> signal poly -> m (signal poly))
     -- press
  -> (a -> Bool)
     -- initial value: audio
  -> b
     -- initial value: trackA
  -> b
     -- initial value: trackB
  -> b
     -- initial value: trackC
  -> b
     -- buttonA (input)
  -> signal a
     -- buttonB (input)
  -> signal a
     -- play (input)
  -> signal b
     -- stop (input)
  -> signal b
     -- outputs
  -> m ( -- audio
         signal b
       , -- trackA
         signal b
       , -- trackB
         signal b
       , -- trackC
         signal b
       )

toy-spec
  cell
  p_press
  i_audio
  i_trackA
  i_trackB
  i_trackC
  s_buttonA
  s_buttonB
  s_play
  s_stop

  = do
      rec
        c_audio <- cell i_audio o_audio
        c_trackA <- cell i_trackA o_trackA
        c_trackB <- cell i_trackB o_trackB
        c_trackC <- cell i_trackC o_trackC

        let b8 = p_press <$> s_buttonA
        let b9 = p_press <$> s_buttonB

        (cout0, cout1, cout2, cout3, cout4, cout5, cout6, cout7, cout8, cout9) <-
          controlCircuit
            cell
            b9
            b8

        let o_audio =
              audioSwitch
                s_stop
                cout7
                s_play
                cout8
                c_audio
                cout9
        let o_trackA =
              trackASwitch
                c_trackA
                cout5
                s_play
                cout6
        let o_trackB =
              trackBSwitch
                c_trackB
                cout2
                s_stop
                cout3
                s_play
                cout4
        let o_trackC =
              trackCSwitch
                c_trackC
                cout0
                s_play
                cout1

      return (o_audio, o_trackA, o_trackB, o_trackC)

-----------------------------------------------------------------------------

audioSwitch
  :: Applicative signal
  => signal a
  -> signal Bool
  -> signal a
  -> signal Bool
  -> signal a
  -> signal Bool
  -> signal a

audioSwitch s0 b0 s1 b1 s2 _ =
  let ite b s a = (\b s a -> if b then s else a) <$> b <*> s <*> a
  in ite b0 s0 $ ite b1 s1 s2

-----------------------------------------------------------------------------

trackASwitch
  :: Applicative signal
  => signal a
  -> signal Bool
  -> signal a
  -> signal Bool
  -> signal a

trackASwitch s0 b0 s1 _ =
  let ite b s a = (\b s a -> if b then s else a) <$> b <*> s <*> a
  in ite b0 s0 s1

-----------------------------------------------------------------------------

trackBSwitch
  :: Applicative signal
  => signal a
  -> signal Bool
  -> signal a
  -> signal Bool
  -> signal a
  -> signal Bool
  -> signal a

trackBSwitch s0 b0 s1 b1 s2 _ =
  let ite b s a = (\b s a -> if b then s else a) <$> b <*> s <*> a
  in ite b0 s0 $ ite b1 s1 s2

-----------------------------------------------------------------------------

trackCSwitch
  :: Applicative signal
  => signal a
  -> signal Bool
  -> signal a
  -> signal Bool
  -> signal a

trackCSwitch s0 b0 s1 _ =
  let ite b s a = (\b s a -> if b then s else a) <$> b <*> s <*> a
  in ite b0 s0 s1

-----------------------------------------------------------------------------

controlCircuit
  :: (MonadFix m, Applicative signal)
     -- cell implementation
  => (Bool -> signal Bool -> m (signal Bool))
     -- inputs
  -> signal Bool
  -> signal Bool
     -- outputs
  -> m ( signal Bool
       , signal Bool
       , signal Bool
       , signal Bool
       , signal Bool
       , signal Bool
       , signal Bool
       , signal Bool
       , signal Bool
       , signal Bool
       )

controlCircuit cell cin0 cin1 =
  do
    rec
    return ((pure False), (pure True), (pure True), (pure False), (pure False), (pure True), (pure False), (pure False), (pure False), (pure True))

-----------------------------------------------------------------------------
