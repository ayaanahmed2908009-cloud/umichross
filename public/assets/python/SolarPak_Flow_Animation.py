import adsk.core, adsk.fusion, time, math

T = 42.0
SEG = T / 7
STEPS = [
    ('1  Sunlight hits the panels: ~2.75 kW DC', (-250, -100, 500)),
    ('2  Controller converts power and runs the pump', (-60, 92, 150)),
    ('3  Submersible pump lifts water up the rising main', (100, 0, -900)),
    ('4  Non-return valve stops backflow; meter logs litres', (100, 0, 100)),
    ('5  Two-stage filter removes sand, arsenic and iron', (20, 60, 100)),
    ('6  Tank fills; float switch stops the pump when full', (-100, 0, 350)),
    ('7  Gravity feeds the 3 taps, day and night', (190, -60, 90)),
]
CAP_Z = [520, 160, -700, 90, 230, 360, 20]

def run(_context):
    app = adsk.core.Application.get()
    design = adsk.fusion.Design.cast(app.activeProduct)
    root = design.rootComponent
    vp = app.activeViewport
    tbm = adsk.fusion.TemporaryBRepManager.get()
    P = adsk.core.Point3D.create
    def mat(rgb, op=1.0, glow=False):
        c = adsk.core.Color.create(rgb[0], rgb[1], rgb[2], 255)
        e = c if glow else adsk.core.Color.create(0, 0, 0, 255)
        return adsk.fusion.CustomGraphicsBasicMaterialColorEffect.create(c, c, adsk.core.Color.create(60, 60, 60, 255), e, 20, op)
    def solid(rgb):
        return adsk.fusion.CustomGraphicsSolidColorEffect.create(adsk.core.Color.create(rgb[0], rgb[1], rgb[2], 255))
    BLUE, ORANGE, YELLOW, WHITE, RED = (55, 138, 221), (239, 159, 39), (250, 199, 117), (255, 255, 255), (226, 75, 74)
    def bb(prefix, pad=0):
        bs = [b for b in root.bRepBodies if b.name.startswith(prefix)]
        if not bs:
            return None
        return (min(b.boundingBox.minPoint.x for b in bs) - pad, min(b.boundingBox.minPoint.y for b in bs) - pad, min(b.boundingBox.minPoint.z for b in bs) - pad,
                max(b.boundingBox.maxPoint.x for b in bs) + pad, max(b.boundingBox.maxPoint.y for b in bs) + pad, max(b.boundingBox.maxPoint.z for b in bs) + pad)
    def box(b):
        x0, y0, z0, x1, y1, z1 = b
        obb = adsk.core.OrientedBoundingBox3D.create(P((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), adsk.core.Vector3D.create(1, 0, 0), adsk.core.Vector3D.create(0, 1, 0), max(x1 - x0, 0.1), max(y1 - y0, 0.1), max(z1 - z0, 0.1))
        return tbm.createBox(obb)
    def along(path, f):
        segs = [(path[i], path[i + 1]) for i in range(len(path) - 1)]
        lens = [math.dist(a, b) for a, b in segs]
        d = (f % 1.0) * sum(lens)
        for (a, b), L in zip(segs, lens):
            if d <= L:
                k = d / L if L else 0
                return P(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k)
            d -= L
        return P(*path[-1])
    def text(grp, s, pt, size, rgb):
        m = adsk.core.Matrix3D.create()
        m.translation = adsk.core.Vector3D.create(pt[0], pt[1], pt[2])
        t = grp.addText(s, 'Arial', size, m)
        t.billBoarding = adsk.fusion.CustomGraphicsBillBoard.create(P(pt[0], pt[1], pt[2]))
        t.color = solid(rgb)
        return t
    power = [(-220, -100, 472), (-220, -140, 450), (-220, -140, 160), (-60, 90, 145), (-60, 90, 10), (105, 0, 10), (105, 0, -850)]
    up = [(100, 0, -850), (100, 0, 190), (100, 60, 190), (60, 60, 190), (60, 60, 140), (20, 60, 140), (20, 60, 210), (100, 60, 210), (100, 0, 210), (100, 0, 421)]
    outlet = [(130, 0, 282), (168, 0, 282), (168, 0, 90), (168, -60, 90), (190, -60, 90)]
    panels = bb('Solar panel', 4)
    v1 = bb('Non-return valve', 8); v2 = bb('Flow meter', 8)
    valves = (min(v1[0], v2[0]), min(v1[1], v2[1]), min(v1[2], v2[2]), max(v1[3], v2[3]), max(v1[4], v2[4]), max(v1[5], v2[5]))
    flt = bb('Float switch', 6)
    s1 = bb('Sediment filter', 6); s2 = bb('Media filter', 6)
    if s1 and s2:
        filt = (min(s1[0], s2[0]), min(s1[1], s2[1]), min(s1[2], s2[2]), max(s1[3], s2[3]), max(s1[4], s2[4]), max(s1[5], s2[5]))
    else:
        filt = s1 or s2
    if not filt:
        up = [(100, 0, -850), (100, 0, 421)]
    wb = [b for b in root.bRepBodies if b.name.startswith('Water')][0]
    w = wb.boundingBox
    wx0, wy0, wz0, wx1, wy1, wz1 = w.minPoint.x, w.minPoint.y, w.minPoint.z, w.maxPoint.x, w.maxPoint.y, w.maxPoint.z
    casing = [b for b in root.bRepBodies if b.name.startswith('Borehole casing')]
    old_op = [b.opacity for b in casing]
    cam = vp.camera
    cam.viewOrientation = adsk.core.ViewOrientations.FrontViewOrientation
    cam.isFitView = True
    vp.camera = cam
    vp.fit()
    wb.isLightBulbOn = False
    for b in casing:
        b.opacity = 0.3
    grp = None
    try:
        t0 = time.time()
        while True:
            t = time.time() - t0
            if t > T + 3.0:
                break
            t = min(t, T)
            phase = min(6, int(t / SEG))
            if grp:
                grp.deleteMe()
            grp = root.customGraphicsGroups.add()
            g = grp.addBRepBody(box(panels))
            g.color = mat(YELLOW, 0.3 + 0.2 * math.sin(t * 2), True)
            if t > SEG:
                for k in range(9):
                    s = grp.addBRepBody(tbm.createSphere(along(power, t * 0.06 + k / 9), 8))
                    s.color = mat(ORANGE, 1, True)
            f = max(0.06, min(1.0, (t - 4.6 * SEG) / (1.2 * SEG)))
            if t > 2 * SEG and f < 1.0:
                for k in range(10):
                    s = grp.addBRepBody(tbm.createSphere(along(up, t * 0.07 + k / 10), 10))
                    s.color = mat(BLUE, 1, True)
            if phase == 3:
                v = grp.addBRepBody(box(valves))
                v.color = mat(YELLOW, 0.6, True)
            if phase == 4 and filt:
                v = grp.addBRepBody(box(filt))
                v.color = mat(YELLOW, 0.45, True)
            wbox = grp.addBRepBody(box((wx0, wy0, wz0, wx1, wy1, wz0 + (wz1 - wz0) * f)))
            wbox.color = mat(BLUE, 0.5)
            if f >= 1.0:
                fl = grp.addBRepBody(box(flt))
                fl.color = mat(RED, 0.9, True)
            if t > 6 * SEG:
                for k in range(4):
                    s = grp.addBRepBody(tbm.createSphere(along(outlet, t * 0.18 + k / 4), 7))
                    s.color = mat(BLUE, 1, True)
                for k in range(3):
                    dz = ((t * 0.8 + k / 3) % 1.0) * 70
                    s = grp.addBRepBody(tbm.createSphere(P(190, -60, 82 - dz), 4))
                    s.color = mat(BLUE, 1, True)
            text(grp, 'SolarPak solar water pump: how it works', (-950, -400, -150), 36, (24, 95, 165))
            cap, target = STEPS[phase]
            cz = CAP_Z[phase]
            text(grp, cap, (-950, -400, cz), 26, (186, 117, 23))
            coords = adsk.fusion.CustomGraphicsCoordinates.create([-300.0, -400.0, cz - 8.0, float(target[0]), float(target[1]), float(target[2])])
            ln = grp.addLines(coords, [0, 1], False)
            ln.color = solid((186, 117, 23))
            ln.weight = 2
            vp.refresh()
            adsk.doEvents()
            time.sleep(0.02)
    finally:
        if grp:
            grp.deleteMe()
        wb.isLightBulbOn = True
        for b, o in zip(casing, old_op):
            b.opacity = o
        vp.refresh()
