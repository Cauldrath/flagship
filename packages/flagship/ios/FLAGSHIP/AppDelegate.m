#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <RNCPushNotificationIOS.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>
#import <ReactNativeNavigation/ReactNativeNavigation.h>


#if DEBUG
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>
static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

#ifdef DEBUG
#import <React/RCTBundleURLProvider.h>
#endif

#import "CodePush.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
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

#if DEBUG
  InitializeFlipper(application);
#endif

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  #if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  #else
    return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  #endif
}

@end
