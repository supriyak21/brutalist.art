"""scenes.py — portrait (9:16) Manim scenes for banking-domain-interview-end-to-end-v2/short.
4 Manim beats survive the Shorts cap-plan: B01, B02, B05, B09 (B08 was dropped along with the
revision cycle B06-B08). These are NOT copies of the parent's landscape scenes — the portrait
frame's coordinate system is much narrower in x (frame_width=4.5, safe ±1.95) while y is
UNCHANGED (frame_height=8.0, safe ±3.4), per manim_layout_audit.py --portrait.

CRITICAL: `manim -r 2160,3840` (CLI resolution flag alone) does NOT recalculate
config.frame_width/frame_height to match a portrait pixel aspect ratio — confirmed by direct
diagnostic render (a radius-1 Circle rendered as a true circle, but a Text.to_edge(LEFT) landed
almost entirely off-frame, and the effective px/unit scale matched frame_width=14.222 /
frame_height=8.0, the 16:9 DEFAULTS, not a portrait shape). That silently compressed every scene
below into a small fraction of the real canvas despite passing Gate B (manim_layout_audit.py's
--portrait mode manually overrides these same two config values in its OWN audit process, so
per-scene geometry checks passed clean while the ACTUAL CLI render used a different, wrong
coordinate space). The two lines below force the real renderer to match what Gate B already
validated against — remove them and this whole file silently underfills again.

IMPORTANT LESSON (v2 of this file): Gate B (manim_layout_audit.py) checks overlaps and
safe-area *crossing* but never checks overall canvas-fill percentage — that's Gate V
(final_frame_check.py) only, run on the COMPILED master, not per-scene. A scene can pass
Gate B clean while still badly underfilling the frame. Every layout below is built with
next_to() CHAINS ONLY (never independent absolute y-positions competing for the same space)
so elements can never silently overlap, and uses generous buffs/large type deliberately
spread across nearly the full ±3.4 safe height, not just fit-within-bounds.
Same palette/helpers as the parent scenes.py.
"""
from manim import *
import numpy as np

# See module docstring — without these two lines, `manim -r 2160,3840` renders
# with the 16:9-default coordinate space (frame_width=14.222, frame_height=8.0)
# instead of the portrait one Gate B validates against.
config.frame_width = 4.5
config.frame_height = 8.0

CREAM = "#FAF9F5"; INK = "#3D3929"; TERRACOTTA = "#D97757"
TEAL = "#1F6F5C"; CRIMSON = "#BF3339"; SEC = "#6B6357"


def checkmark(color=TEAL, size=0.32):
    mark = VMobject(color=color, stroke_width=7)
    mark.set_points_as_corners([
        np.array([-0.5, 0.05, 0]) * size,
        np.array([-0.1, -0.45, 0]) * size,
        np.array([0.55, 0.5, 0]) * size,
    ])
    return mark


def wrap(text, n):
    words, lines, cur = text.split(), [], ""
    for w in words:
        if len(cur) + len(w) + 1 <= n:
            cur = (cur + " " + w).strip()
        else:
            lines.append(cur); cur = w
    if cur:
        lines.append(cur)
    return "\n".join(lines)


def pad(scene, elapsed, target):
    scene.wait(max(0.4, target - elapsed - 0.2))


class B01_TheSecondLanguage(Scene):
    """PROBLEM beat, portrait — full-height stack, next_to chain throughout."""
    DUR = 26.69

    def construct(self):
        self.camera.background_color = CREAM
        elapsed = 0.0

        head = Text(wrap("You already know this.", 14), color=INK, weight="BOLD",
                     font_size=32, line_spacing=1.1).to_edge(UP, buff=0.75)
        self.play(Write(head), run_time=1.1); elapsed += 1.1

        sql = RoundedRectangle(corner_radius=0.1, width=1.6, height=0.72, color=TEAL,
                                stroke_width=4.5, fill_color=CREAM, fill_opacity=1)
        py = RoundedRectangle(corner_radius=0.1, width=1.6, height=0.72, color=TEAL,
                               stroke_width=4.5, fill_color=CREAM, fill_opacity=1)
        sql_txt = Text("SQL", color=INK, weight="BOLD", font_size=28)
        py_txt = Text("Python", color=INK, weight="BOLD", font_size=25)
        sql_grp = VGroup(sql, sql_txt); py_grp = VGroup(py, py_txt)
        boxes = VGroup(sql_grp, py_grp).arrange(RIGHT, buff=0.25).next_to(head, DOWN, buff=0.4)
        sql_txt.move_to(sql.get_center()); py_txt.move_to(py.get_center())
        self.play(FadeIn(sql, shift=RIGHT * 0.3), FadeIn(py, shift=LEFT * 0.3), run_time=0.8)
        self.play(FadeIn(sql_txt), FadeIn(py_txt), run_time=0.4)
        elapsed += 1.2

        lock = Text("solid", color=SEC, font_size=22, slant="ITALIC").next_to(
            boxes, DOWN, buff=0.28)
        self.play(FadeIn(lock, shift=UP * 0.1), run_time=0.6); elapsed += 0.6

        chip_labels = ["OCC", "CFPB", "CET1", "LCR", "charge-off"]
        def make_chip(label):
            chip = RoundedRectangle(corner_radius=0.26, width=len(label) * 0.155 + 0.5, height=0.6,
                                     color=TERRACOTTA, stroke_width=3, fill_color=TERRACOTTA,
                                     fill_opacity=0.0)
            ctxt = Text(label, color=TERRACOTTA, weight="BOLD", font_size=21)
            ctxt.move_to(chip.get_center())
            return VGroup(chip, ctxt)

        row1 = VGroup(*[make_chip(l) for l in chip_labels[:3]]).arrange(RIGHT, buff=0.16)
        row2 = VGroup(*[make_chip(l) for l in chip_labels[3:]]).arrange(RIGHT, buff=0.16)
        chips = VGroup(row1, row2).arrange(DOWN, buff=0.18).next_to(lock, DOWN, buff=0.3)
        self.play(LaggedStart(*[FadeIn(c, shift=UP * 0.15) for c in (*row1, *row2)],
                              lag_ratio=0.15, run_time=1.6)); elapsed += 1.6
        self.play(*[c[0].animate.set_fill(opacity=0.14) for c in (*row1, *row2)], run_time=0.5)
        elapsed += 0.5

        layer_label = Text(wrap("the layer banking adds", 20), color=TERRACOTTA, weight="BOLD",
                            font_size=24, line_spacing=1.1).next_to(chips, DOWN, buff=0.24)
        self.play(FadeIn(layer_label, shift=UP * 0.1), run_time=0.7); elapsed += 0.7

        closer = Text(wrap("Miss it, and “technically perfect” still "
                            "reads as “never worked in banking.”", 30),
                      color=INK, weight="BOLD", font_size=19, line_spacing=1.1,
                      ).next_to(layer_label, DOWN, buff=0.1)
        self.play(Write(closer), run_time=1.8); elapsed += 1.8

        pad(self, elapsed, self.DUR)


class B02_SixPartMap(Scene):
    """MECHANISM beat, portrait — the six-part map as a vertical chain, full-width boxes."""
    DUR = 19.41

    PARTS = [
        ("I", "Landscape"), ("II", "Regulation & Risk"), ("III", "Data Stack"),
        ("IV", "Technical Prep"), ("V", "Behavioral & Case"), ("VI", "Day-Of"),
    ]

    def construct(self):
        self.camera.background_color = CREAM
        elapsed = 0.0

        head = Text("Six parts.", color=INK, weight="BOLD", font_size=40).to_edge(UP, buff=0.65)
        self.play(Write(head), run_time=0.9); elapsed += 0.9

        rows = VGroup()
        for numeral, label in self.PARTS:
            box = RoundedRectangle(corner_radius=0.1, width=3.75, height=0.66,
                                    color=TEAL, stroke_width=3.5, fill_color=CREAM, fill_opacity=1)
            num = Text(numeral, color=TERRACOTTA, weight="BOLD", font_size=25)
            lbl = Text(label, color=INK, font_size=25)
            row_txt = VGroup(num, lbl).arrange(RIGHT, buff=0.25)
            row_txt.move_to(box.get_center())
            rows.add(VGroup(box, row_txt))
        rows.arrange(DOWN, buff=0.17).next_to(head, DOWN, buff=0.5)

        arrows = VGroup(*[
            Arrow(rows[i].get_bottom(), rows[i + 1].get_top(), buff=0.03,
                  color=SEC, stroke_width=3, max_tip_length_to_length_ratio=0.5)
            for i in range(len(rows) - 1)
        ])

        for i, r in enumerate(rows):
            self.play(FadeIn(r, shift=RIGHT * 0.15), run_time=0.45)
            elapsed += 0.45
            if i > 0:
                self.play(Create(arrows[i - 1]), run_time=0.12)
                elapsed += 0.12

        self.play(Indicate(rows, color=TERRACOTTA, scale_factor=1.02), run_time=0.8)
        elapsed += 0.8

        tag = Text(wrap("one gap, mapped end to end", 20), color=SEC, font_size=24,
                    slant="ITALIC").next_to(rows, DOWN, buff=0.3)
        self.play(FadeIn(tag, shift=UP * 0.1), run_time=0.6); elapsed += 0.6

        pad(self, elapsed, self.DUR)


class B05_CorrectBalance(Scene):
    """OUTPUT beat, portrait — the correct running-balance result, full next_to chain."""
    DUR = 17.3

    def construct(self):
        self.camera.background_color = CREAM
        elapsed = 0.0

        title = Text(wrap("ACCT-50231 — end-of-month balance", 18), color=INK, weight="BOLD",
                      font_size=28, line_spacing=1.15).to_edge(UP, buff=0.7)
        self.play(Write(title), run_time=1.1); elapsed += 1.1

        month_hdr = Text("Month", color=SEC, font_size=24, weight="BOLD")
        bal_hdr = Text("Balance", color=SEC, font_size=24, weight="BOLD")
        header = VGroup(month_hdr, bal_hdr).next_to(title, DOWN, buff=0.4)
        month_hdr.move_to([-1.15, header.get_y(), 0])
        bal_hdr.move_to([1.05, header.get_y(), 0])
        rule = Line([-1.85, 0, 0], [1.85, 0, 0], color=SEC, stroke_width=2.5).next_to(
            header, DOWN, buff=0.15)
        self.play(FadeIn(header), run_time=0.4); elapsed += 0.4
        self.play(Create(rule), run_time=0.4); elapsed += 0.4

        rows_data = [("Jan 2026", "$12,100"), ("Feb 2026", "$12,250"), ("Mar 2026", "$12,175")]
        rows = VGroup()
        prev = rule
        for month, value in rows_data:
            m = Text(month, color=INK, font_size=24)
            v = Text(value, color=TEAL, weight="BOLD", font_size=26)
            row = VGroup(m, v).next_to(prev, DOWN, buff=0.32)
            m.move_to([-1.15, row.get_y(), 0]); v.move_to([1.05, row.get_y(), 0])
            rows.add(row); prev = row
        self.play(LaggedStart(*[FadeIn(r, shift=UP * 0.12) for r in rows],
                              lag_ratio=0.6, run_time=1.8)); elapsed += 1.8

        note = Text(wrap("Jan's balance still carries the Nov 2025 deposit", 28),
                     color=SEC, font_size=19, slant="ITALIC",
                     line_spacing=1.1).next_to(rows, DOWN, buff=0.3)
        self.play(FadeIn(note, shift=UP * 0.1), run_time=0.7); elapsed += 0.7

        badge = RoundedRectangle(corner_radius=0.12, width=3.75, height=0.85, color=TEAL,
                                  stroke_width=3, fill_color=TEAL, fill_opacity=0.12).next_to(
                                      note, DOWN, buff=0.25)
        badge_txt = Text(wrap("SAW THE WHOLE LEDGER FIRST", 16), color=TEAL, weight="BOLD",
                          font_size=20, line_spacing=1.1).move_to(badge.get_center())
        self.play(FadeIn(badge), FadeIn(badge_txt), run_time=0.5); elapsed += 0.5
        self.play(Indicate(VGroup(badge, badge_txt), color=TEAL, scale_factor=1.04), run_time=0.8)
        elapsed += 0.8

        pad(self, elapsed, self.DUR)


class B09_TwoMoves(Scene):
    """SUMMARY beat, portrait — checklist + a single-column chip stack, full next_to chain."""
    DUR = 17.69

    def construct(self):
        self.camera.background_color = CREAM
        elapsed = 0.0

        head = Text("Two moves.", color=INK, weight="BOLD", font_size=46)
        head.to_edge(UP, buff=0.7).to_edge(LEFT, buff=0.35)
        rule = Rectangle(width=1.75, height=0.08, color=TERRACOTTA, fill_color=TERRACOTTA,
                          fill_opacity=1, stroke_width=0).next_to(head, DOWN, buff=0.28, aligned_edge=LEFT)
        self.play(Write(head), run_time=0.8); elapsed += 0.8
        self.play(GrowFromEdge(rule, LEFT), run_time=0.35); elapsed += 0.35

        items = ["Get the SQL order right", "Never lose the cohort"]
        rows = VGroup()
        for it in items:
            check = checkmark(size=0.4)
            txt = Text(wrap(it, 15), color=INK, font_size=28, line_spacing=1.1)
            row = VGroup(check, txt).arrange(RIGHT, buff=0.28, aligned_edge=UP)
            rows.add(row)
        rows.arrange(DOWN, aligned_edge=LEFT, buff=0.36).next_to(rule, DOWN, buff=0.4, aligned_edge=LEFT)
        self.play(LaggedStart(*[FadeIn(r, shift=RIGHT * 0.2) for r in rows],
                              lag_ratio=0.6, run_time=1.6)); elapsed += 1.6

        rest_label = Text(wrap("the rest of the book →", 18), color=SEC, font_size=23,
                           slant="ITALIC").next_to(rows, DOWN, buff=0.34, aligned_edge=LEFT)
        self.play(FadeIn(rest_label, shift=UP * 0.1), run_time=0.6); elapsed += 0.6

        def make_chip(label):
            chip = RoundedRectangle(corner_radius=0.2, width=3.6, height=0.52,
                                     color=TEAL, stroke_width=2.5, fill_color=CREAM, fill_opacity=1)
            ctxt = Text(label, color=INK, font_size=21)
            ctxt.move_to(chip.get_center())
            return VGroup(chip, ctxt)

        chips = VGroup(*[make_chip(l) for l in
                         ["Regulation", "Data Stack", "Behavioral & Case", "Day-Of"]])
        chips.arrange(DOWN, buff=0.08, aligned_edge=LEFT).next_to(rest_label, DOWN, buff=0.08, aligned_edge=LEFT)
        self.play(LaggedStart(*[FadeIn(c, shift=UP * 0.12) for c in chips],
                              lag_ratio=0.2, run_time=1.2)); elapsed += 1.2

        pad(self, elapsed, self.DUR)
