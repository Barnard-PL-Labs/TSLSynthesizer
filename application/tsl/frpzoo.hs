-----------------------------------------------------------------------------
-- |
-- Module : Frpzoo
--
-- Applicative Interface for frpzoo.
--
-----------------------------------------------------------------------------

{-# LANGUAGE Rank2Types, RecursiveDo #-}

-----------------------------------------------------------------------------

module Frpzoo
  ( frpzoo
  ) where

-----------------------------------------------------------------------------

import Control.Monad.Fix
  ( MonadFix
  )

-----------------------------------------------------------------------------

frpzoo
  :: (MonadFix m, Applicative signal)
     -- cell implementation
  => (forall poly. poly -> signal poly -> m (signal poly))
     -- activated
  -> (b -> Bool)
     -- clicked0
  -> (a -> Bool)
     -- clicked10
  -> (a -> Bool)
     -- clicked5
  -> (a -> Bool)
     -- minusOne
  -> d
     -- zero
  -> d
     -- inc
  -> (d -> d)
     -- setLabel
  -> (d -> c)
     -- initial value: display0
  -> c
     -- initial value: display10
  -> c
     -- initial value: display5
  -> c
     -- initial value: value0
  -> d
     -- initial value: value10
  -> d
     -- initial value: value5
  -> d
     -- buttonEvent (input)
  -> signal a
     -- toggle0 (input)
  -> signal b
     -- toggle10 (input)
  -> signal b
     -- toggle5 (input)
  -> signal b
     -- outputs
  -> m ( -- display0
         signal c
       , -- display10
         signal c
       , -- display5
         signal c
       , -- value0
         signal d
       , -- value10
         signal d
       , -- value5
         signal d
       )

frpzoo
  cell
  p_activated
  p_clicked0
  p_clicked10
  p_clicked5
  f_minusOne
  f_zero
  f_inc
  f_setLabel
  i_display0
  i_display10
  i_display5
  i_value0
  i_value10
  i_value5
  s_buttonEvent
  s_toggle0
  s_toggle10
  s_toggle5

  = do
      rec
        c_display0 <- cell i_display0 o_display0
        c_display10 <- cell i_display10 o_display10
        c_display5 <- cell i_display5 o_display5
        c_value0 <- cell i_value0 o_value0
        c_value10 <- cell i_value10 o_value10
        c_value5 <- cell i_value5 o_value5

        let w10 = pure f_minusOne
        let w11 = pure f_zero
        let w12 = f_inc <$> c_value0
        let w13 = f_inc <$> c_value10
        let w14 = f_inc <$> c_value5
        let w15 = f_setLabel <$> c_value0
        let w16 = f_setLabel <$> c_value10
        let w17 = f_setLabel <$> c_value5
        let w18 = f_setLabel <$> w10
        let b19 = p_activated <$> s_toggle0
        let b20 = p_activated <$> s_toggle10
        let b21 = p_activated <$> s_toggle5
        let b22 = p_clicked0 <$> s_buttonEvent
        let b23 = p_clicked10 <$> s_buttonEvent
        let b24 = p_clicked5 <$> s_buttonEvent

        (cout0, cout1, cout2, cout3, cout4, cout5, cout6, cout7, cout8, cout9, cout10, cout11, cout12, cout13, cout14, cout15) <-
          controlCircuit
            cell
            b24
            b23
            b22
            b21
            b20
            b19

        let o_display0 =
              display0Switch
                w18
                cout13
                w15
                cout14
                c_display0
                cout15
        let o_display10 =
              display10Switch
                w18
                cout10
                w16
                cout11
                c_display10
                cout12
        let o_display5 =
              display5Switch
                w18
                cout7
                w17
                cout8
                c_display5
                cout9
        let o_value0 =
              value0Switch
                w12
                cout4
                w11
                cout5
                c_value0
                cout6
        let o_value10 =
              value10Switch
                w13
                cout2
                c_value10
                cout3
        let o_value5 =
              value5Switch
                w14
                cout0
                c_value5
                cout1

      return (o_display0, o_display10, o_display5, o_value0, o_value10, o_value5)

-----------------------------------------------------------------------------

display0Switch
  :: Applicative signal
  => signal a
  -> signal Bool
  -> signal a
  -> signal Bool
  -> signal a
  -> signal Bool
  -> signal a

display0Switch s0 b0 s1 b1 s2 _ =
  let ite b s a = (\b s a -> if b then s else a) <$> b <*> s <*> a
  in ite b0 s0 $ ite b1 s1 s2

-----------------------------------------------------------------------------

display10Switch
  :: Applicative signal
  => signal a
  -> signal Bool
  -> signal a
  -> signal Bool
  -> signal a
  -> signal Bool
  -> signal a

display10Switch s0 b0 s1 b1 s2 _ =
  let ite b s a = (\b s a -> if b then s else a) <$> b <*> s <*> a
  in ite b0 s0 $ ite b1 s1 s2

-----------------------------------------------------------------------------

display5Switch
  :: Applicative signal
  => signal a
  -> signal Bool
  -> signal a
  -> signal Bool
  -> signal a
  -> signal Bool
  -> signal a

display5Switch s0 b0 s1 b1 s2 _ =
  let ite b s a = (\b s a -> if b then s else a) <$> b <*> s <*> a
  in ite b0 s0 $ ite b1 s1 s2

-----------------------------------------------------------------------------

value0Switch
  :: Applicative signal
  => signal a
  -> signal Bool
  -> signal a
  -> signal Bool
  -> signal a
  -> signal Bool
  -> signal a

value0Switch s0 b0 s1 b1 s2 _ =
  let ite b s a = (\b s a -> if b then s else a) <$> b <*> s <*> a
  in ite b0 s0 $ ite b1 s1 s2

-----------------------------------------------------------------------------

value10Switch
  :: Applicative signal
  => signal a
  -> signal Bool
  -> signal a
  -> signal Bool
  -> signal a

value10Switch s0 b0 s1 _ =
  let ite b s a = (\b s a -> if b then s else a) <$> b <*> s <*> a
  in ite b0 s0 s1

-----------------------------------------------------------------------------

value5Switch
  :: Applicative signal
  => signal a
  -> signal Bool
  -> signal a
  -> signal Bool
  -> signal a

value5Switch s0 b0 s1 _ =
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
  -> signal Bool
  -> signal Bool
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
       , signal Bool
       , signal Bool
       , signal Bool
       , signal Bool
       , signal Bool
       , signal Bool
       )

controlCircuit cell cin0 cin1 cin2 cin3 cin4 cin5 =
  do
    rec
      let a7 = _not_ cin3
      let w7 = _and_ a7 cin0
      let a8 = _not_ cin5
      let w8 = _and_ a8 cin2
      let a9 = _not_ cin5
      let b9 = _not_ cin2
      let w9 = _and_ a9 b9
      let o1 = _not_ w7
      let o3 = _not_ cin1
      let o8 = _not_ cin3
      let o11 = _not_ cin4
      let o14 = _not_ cin5
    return (w7, o1, cin1, o3, w8, cin5, w9, cin3, o8, (pure False), cin4, o11, (pure False), cin5, o14, (pure False))

  where
    _and_ x y = (&&) <$> x <*> y
    _not_ = fmap not

-----------------------------------------------------------------------------
