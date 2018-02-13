#!/usr/bin/env bash

sudo -HE echo $JAVA_HOME
sudo -HE echo $ANDROID_HOME
sudo -HE ionic cordova build --release android
cp platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk dist
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore key/release-key.keystore dist/app-release-unsigned.apk ingatlanfigyelo
zipalign -v 4 dist/app-release-unsigned.apk dist/ingatlanfigyelo.apk
rm dist/app-release-unsigned.apk
