package com.protosol.moviesandme

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.zoontek.rnbootsplash.RNBootSplash

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "MoviesAndMe"

  override fun onCreate(savedInstanceState: Bundle?) {
    RNBootSplash.init(this, R.style.BootTheme)
    super.onCreate(savedInstanceState)
    // Si tu as un souci de navigation/restore (react-native-screens), essaye: super.onCreate(null)
  }

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
