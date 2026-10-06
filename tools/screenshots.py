from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch()
    for name,vp in [('d',{'width':1280,'height':900}),('m',{'width':390,'height':800})]:
        pg=b.new_page(viewport=vp);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file:///home/claude/sim3/simulador.html');pg.wait_for_timeout(400)
        if name=='d':pg.screenshot(path='t0.png')
        pg.evaluate("localStorage.setItem('simpol-tut','1');showStart()")
        pg.click('[data-act=start][data-k=PT]')
        def clear():
            for _ in range(14):
                loc=pg.locator('#modal:not([hidden]) [data-act=ev],#modal:not([hidden]) [data-act=after],#modal:not([hidden]) [data-act=adv],#modal:not([hidden]) [data-act=camp],#modal:not([hidden]) [data-act=next],#modal:not([hidden]) [data-act=close]')
                if loc.count()==0:break
                loc.first.click()
        clear()
        for i in range(10):
            pg.click('#btnEnd');clear()
        pg.click('[data-act=tab][data-k=ind]');pg.wait_for_timeout(200);pg.screenshot(path=f'i_{name}.png',full_page=True)
        pg.click('[data-act=tab][data-k=coal]');pg.wait_for_timeout(200);pg.screenshot(path=f'c_{name}.png',full_page=True)
        pg.click('[data-act=tab][data-k=gov]');pg.wait_for_timeout(200);pg.screenshot(path=f'g_{name}.png')
        print(name,errs)
        pg.evaluate("S.ano=2030;S.q=4;finish('Teste','x','quit')");pg.wait_for_timeout(200);pg.locator('#modal').screenshot(path=f'f_{name}.png')
    b.close()
