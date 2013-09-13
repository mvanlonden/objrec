@import <Foundation/CPObject.j>
@import "PhotoInspector.j"

@implementation AppController : CPObject
{
}

- (void)applicationDidFinishLaunching:(CPNotification)aNotification
{
    var theWindow = [[CPWindow alloc]
                        initWithContentRect:CGRectMakeZero()
                        styleMask:CPBorderlessBridgeWindowMask],
        contentView = [theWindow contentView];

    [contentView setBackgroundColor:[CPColor blackColor]];

    [theWindow orderFront:self];

    var theInspector = [[PhotoInspector alloc] init];

    [theInspector showWindow:self];
}

@end
