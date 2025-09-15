import asyncio
from playwright import async_api

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3000", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # Assert color contrast for header text
        header_color = await page.eval_on_selector('h1', 'element => getComputedStyle(element).color')
        header_bg_color = await page.eval_on_selector('h1', 'element => getComputedStyle(element).backgroundColor')
        header_contrast_ratio = await page.evaluate("""(fg, bg) => {
          // Function to calculate luminance
          function luminance(r, g, b) {
            var a = [r, g, b].map(function (v) {
              v /= 255;
              return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            });
            return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
          }
          // Parse rgb string
          function rgbToArray(rgb) {
            return rgb.match(/\d+/g).map(Number);
          }
          const fgRgb = rgbToArray(fg);
          const bgRgb = rgbToArray(bg);
          const lum1 = luminance(fgRgb[0], fgRgb[1], fgRgb[2]);
          const lum2 = luminance(bgRgb[0], bgRgb[1], bgRgb[2]);
          const brightest = Math.max(lum1, lum2);
          const darkest = Math.min(lum1, lum2);
          return (brightest + 0.05) / (darkest + 0.05);
        }", header_color, header_bg_color)
        assert header_contrast_ratio >= 4.5, f"Header text contrast ratio {header_contrast_ratio} is below WCAG AA standard"
        
        # Assert color contrast for sign in button text
        button_color = await page.eval_on_selector('button', 'element => getComputedStyle(element).color')
        button_bg_color = await page.eval_on_selector('button', 'element => getComputedStyle(element).backgroundColor')
        button_contrast_ratio = await page.evaluate("""(fg, bg) => {
          function luminance(r, g, b) {
            var a = [r, g, b].map(function (v) {
              v /= 255;
              return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            });
            return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
          }
          function rgbToArray(rgb) {
            return rgb.match(/\d+/g).map(Number);
          }
          const fgRgb = rgbToArray(fg);
          const bgRgb = rgbToArray(bg);
          const lum1 = luminance(fgRgb[0], fgRgb[1], fgRgb[2]);
          const lum2 = luminance(bgRgb[0], bgRgb[1], bgRgb[2]);
          const brightest = Math.max(lum1, lum2);
          const darkest = Math.min(lum1, lum2);
          return (brightest + 0.05) / (darkest + 0.05);
        }", button_color, button_bg_color)
        assert button_contrast_ratio >= 4.5, f"Sign in button text contrast ratio {button_contrast_ratio} is below WCAG AA standard"
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    