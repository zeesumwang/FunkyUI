import webview

window = webview.create_window('FunkyUI', 'http://192.168.2.22:8080/#/', fullscreen=True,text_select=True, resizable=True,min_size=(200, 100),background_color='#0d0d0d')

webview.start()
