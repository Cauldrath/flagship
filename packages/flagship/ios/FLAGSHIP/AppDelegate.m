/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <RNCPushNotificationIOS.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>
#import <ReactNativeNavigation/ReactNativeNavigation.h>

#ifdef DEBUG
#import <React/RCTBundleURLProvider.h>
#endif

#import "lib/FKUserDefaultsSwizzleUtility.m"
#import "CodePush.h"

@implementation AppDelegate

NSString* const kStandardUserDefaultsName = @"Standard UserDefaults";
NSString* const kAppSuiteUserDefaultsName = @"App Suite UserDefaults";

NSUserDefaults* _standardUserDefaults;

- (void)userDefaults:(NSUserDefaults*)userDefaults
    changedWithValue:(id)value
    key:(NSString*)key {
  NSTimeInterval interval = [[NSDate date] timeIntervalSince1970] * 1000;
  NSString* intervalStr = [NSString stringWithFormat:@"%f", interval];
  NSMutableDictionary* params =
      [@{@"name" : key, @"time" : intervalStr} mutableCopy];

  if (!value) {
    [params setObject:@"YES" forKey:@"deleted"];
  } else {
    [params setObject:value forKey:@"value"];
  }

  NSString* sharedPreferencesName =
      (userDefaults == _standardUserDefaults ? kStandardUserDefaultsName
                                             : kAppSuiteUserDefaultsName);
  [params setObject:sharedPreferencesName forKey:@"preferences"];
}

- (void)flipperPluginCalls {
    _standardUserDefaults = [NSUserDefaults standardUserDefaults];
    __weak typeof(self) weakSelf = self;
    [FKUserDefaultsSwizzleUtility
        swizzleSelector:@selector(setObject:forKey:)
                  class:[NSUserDefaults class]
                  block:^(NSInvocation* _Nonnull invocation) {
                    __unsafe_unretained id firstArg = nil;
                    __unsafe_unretained id secondArg = nil;
                    [invocation getArgument:&firstArg atIndex:2];
                    [invocation getArgument:&secondArg atIndex:3];
                    [invocation invoke];
                    [weakSelf userDefaults:([invocation.target
                                                isKindOfClass:[NSUserDefaults
                                                                  class]]
                                                ? invocation.target
                                                : nil)
                          changedWithValue:firstArg
                                       key:secondArg];
                  }];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
[self flipperPluginCalls];
NSURL *jsCodeLocation;

#if __has_include(<AppCenterReactNativeCrashes/AppCenterReactNativeCrashes.h>)
  [AppCenterReactNativeCrashes registerWithAutomaticProcessing];
#endif

#if __has_include(<AppCenterReactNativeAnalytics/AppCenterReactNativeAnalytics.h>)
  [AppCenterReactNativeAnalytics registerWithInitiallyEnabled:true];
#endif

#if __has_include(<AppCenterReactNative/AppCenterReactNative.h>)
  [AppCenterReactNative register];
#endif

#ifdef DEBUG
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
#if __has_include(<CodePush/CodePush.h>)
  jsCodeLocation = [CodePush bundleURL];
#else
  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
#endif

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.backgroundColor = [UIColor whiteColor];

  NSMutableDictionary *copyOfLaunchOptions = [launchOptions mutableCopy];

  if (launchOptions[@"UIApplicationLaunchOptionsRemoteNotificationKey"] && [launchOptions[@"UIApplicationLaunchOptionsRemoteNotificationKey"] isKindOfClass:[NSDictionary class]]) {
      NSDictionary *notification = launchOptions[@"UIApplicationLaunchOptionsRemoteNotificationKey"];
      if (notification[@"_lpx"] && [notification[@"_lpx"] isKindOfClass:[NSDictionary class]]) {
          NSDictionary *lpx = notification[@"_lpx"];
          if (lpx[@"URL"] && [lpx[@"URL"] isKindOfClass:[NSString class]]) {
              NSString *url = lpx[@"URL"];
              copyOfLaunchOptions[@"UIApplicationLaunchOptionsURLKey"] = [NSURL URLWithString:url];
          }
      }
  }

  launchOptions = copyOfLaunchOptions;

  [ReactNativeNavigation bootstrap:jsCodeLocation launchOptions:launchOptions];

  return YES;
}

// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RNCPushNotificationIOS didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RNCPushNotificationIOS didReceiveLocalNotification:notification];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  return [RCTLinkingManager application:application openURL:url
                      sourceApplication:sourceApplication annotation:annotation];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler
{
  return [RCTLinkingManager application:application
                   continueUserActivity:userActivity
                     restorationHandler:restorationHandler];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  #if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  #else
    return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  #endif
}

@end
