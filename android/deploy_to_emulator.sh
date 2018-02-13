#!/usr/bin/env bash

sudo -HE echo $JAVA_HOME
sudo -HE echo $ANDROID_HOME
sudo -HE ionic cordova run android --emulator
