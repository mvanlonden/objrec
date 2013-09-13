@import <AppKit/CPPanel.j>
@import <AppKit/CPWindowController.j>

@implementation PhotoInspector : CPWindowController
{
}

- (id)init
{
    var theWindow = [[CPPanel alloc]
        initWithContentRect:CGRectMake(0, 0, 225, 125)
        styleMask:CPHUDBackgroundWindowMask | CPClosableWindowMask];

    self = [super initWithWindow:theWindow];

    if (self)
    {
        [theWindow setTitle:@"Inspector"];
        [theWindow setFloatingPanel:YES];

        var contentView = [theWindow contentView],
            centerX = (CGRectGetWidth([contentView bounds]) - 135) / 2;

        scaleSlider = [[CPButton alloc]
           initWithFrame:CGRectMake(centerX, 13, 135, 24)];

        //[scaleSlider setValue: [CPColor redColor] forThemeAttribute:@"bezel-color"];

        [contentView addSubview:scaleSlider];

        rotationSlider = [[CPSlider alloc]
            initWithFrame:CGRectMake(centerX, 73, 135, 24)];

        [rotationSlider setMinValue:0];
        [rotationSlider setMaxValue:360];
        [rotationSlider setValue:0];

        [contentView addSubview:rotationSlider];

        var rotationStartLabel = [self labelWithTitle:"0\u00B0"],
            rotationEndLabel = [self labelWithTitle:"360\u00B0"];

        [rotationStartLabel setFrameOrigin:CGPointMake(centerX -
            CGRectGetWidth([rotationStartLabel frame]), 70)];
        [rotationEndLabel setFrameOrigin:
            CGPointMake(CGRectGetMaxX([rotationSlider frame]), 70)];

        [contentView addSubview:rotationStartLabel];
        [contentView addSubview:rotationEndLabel];
    }

    return self;
}

- (CPTextField)labelWithTitle:(CPString)aTitle
{
    var label = [[CPTextField alloc] initWithFrame:CGRectMakeZero()];

    [label setStringValue:aTitle];
    [label setTextColor:[CPColor whiteColor]];

    [label sizeToFit];

    return label;
}

@end
