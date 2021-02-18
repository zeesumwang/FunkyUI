
import webview


def on_closed():
    print('pywebview window is closed')


def on_closing():
    print('pywebview window is closing')


def on_shown():
    print('pywebview window shown')


def on_loaded():
    print('DOM is ready')

    # unsubscribe event listener
    webview.windows[0].loaded -= on_loaded
    # webview.windows[0].show()
    # webview.windows[0].on_top = False

if __name__ == '__main__':

    window = webview.create_window('funkyUI',
                          'http://192.168.2.22:8081/#/',
                           width=1033,
                           height=800,
                           on_top=False,
                           fullscreen=False,
                           text_select=True,
                           resizable=True,
                           min_size=(200, 100),
                           background_color='#0d0d0d',
                           frameless=True,
                           easy_drag=True)

    window.closed += on_closed
    window.closing += on_closing
    window.shown += on_shown
    window.loaded += on_loaded

    webview.start(debug=True)
