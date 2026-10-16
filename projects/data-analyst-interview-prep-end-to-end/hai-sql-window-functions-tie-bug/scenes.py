"""
Manim scenes for hai-sql-window-functions-tie-bug.
5 scenes for the GRAPHIC-lane beats named in beat_sheet.json's shot.manim field.
Humanitarians palette (matches runtime/remotion/src/tokens/humanitarians.ts).
"""

from manim import *

H = {
    "CREAM": "#F3EBDD",
    "INK": "#2F2A26",
    "TEAL": "#1F4E5F",
    "CRIMSON": "#E4572E",
    "SLATE": "#29335C",
    "GOLD": "#F3A712",
}

SERIF = "EB Garamond"
SANS = "Montserrat"
MONO = "PT Mono"


def caption(text, y=-3.3):
    return Text(text, font=SERIF, font_size=28, slant=ITALIC, color=H["INK"]).move_to([0, y, 0])


class B01_ProblemStakes(Scene):
    def construct(self):
        self.camera.background_color = H["CREAM"]
        title = Text("plays(user_id, track_id, played_at)", font=MONO, font_size=30, color=H["INK"], weight="BOLD")
        title.to_edge(UP, buff=0.7)
        self.play(FadeIn(title), run_time=0.6)

        rows = VGroup(
            Text("user 101 · track Echo", font=SANS, font_size=26, color=H["INK"]),
            Text("user 101 · track Nova", font=SANS, font_size=26, color=H["INK"]),
        ).arrange(DOWN, buff=0.7).move_to([-2.6, 0.3, 0])
        self.play(Write(rows), run_time=1.0)

        bar_echo = Rectangle(width=2.0, height=0.5, color=H["TEAL"], fill_color=H["TEAL"], fill_opacity=1)
        bar_nova = Rectangle(width=2.0, height=0.5, color=H["TEAL"], fill_color=H["TEAL"], fill_opacity=1)
        bar_echo.next_to(rows[0], RIGHT, buff=0.6)
        bar_nova.next_to(rows[1], RIGHT, buff=0.6)
        self.play(Create(bar_echo), Create(bar_nova), run_time=1.0)

        count_echo = Text("5", font=MONO, font_size=30, color="#FFFFFF", weight="BOLD").move_to(bar_echo.get_center())
        count_nova = Text("5", font=MONO, font_size=30, color="#FFFFFF", weight="BOLD").move_to(bar_nova.get_center())
        self.play(Write(count_echo), Write(count_nova), run_time=0.6)

        tie_mark = Text("TIE", font=SANS, font_size=26, color=H["CRIMSON"], weight="BOLD")
        tie_mark.move_to([2.2, 0.3, 0])
        ring = Circle(radius=0.55, color=H["CRIMSON"], stroke_width=4).move_to(tie_mark.get_center())
        self.play(FadeIn(tie_mark), Create(ring), run_time=0.6)
        self.play(ring.animate.set_stroke(width=6), run_time=0.3)
        self.play(ring.animate.set_stroke(width=4), run_time=0.3)

        cap = caption("Top-N per group — until two rows tie.")
        self.play(FadeIn(cap), run_time=0.5)
        self.wait(1.2)


class B02_WindowVsGroupBy(Scene):
    def construct(self):
        self.camera.background_color = H["CREAM"]
        divider = Line([0, 3.2, 0], [0, -2.6, 0], color=H["INK"], stroke_width=2)
        left_title = Text("GROUP BY", font=SANS, font_size=28, color=H["CRIMSON"], weight="BOLD").move_to([-3.2, 3.0, 0])
        right_title = Text("Window function", font=SANS, font_size=28, color=H["TEAL"], weight="BOLD").move_to([3.2, 3.0, 0])
        self.play(FadeIn(divider), FadeIn(left_title), FadeIn(right_title), run_time=0.6)

        tracks = ["Echo", "Nova", "Drift"]
        left_rows = VGroup(*[Text(t, font=SANS, font_size=24, color=H["INK"]) for t in tracks])
        left_rows.arrange(DOWN, buff=0.4).move_to([-3.2, 1.2, 0])
        self.play(Write(left_rows), run_time=0.8)

        collapsed = Text("user 101: 3 plays", font=SANS, font_size=24, color=H["CRIMSON"], weight="BOLD")
        collapsed.move_to([-3.2, 1.2, 0])
        self.play(FadeOut(left_rows), FadeIn(collapsed), run_time=0.9)
        detail_gone = Text("(per-track detail: gone)", font=SERIF, font_size=20, slant=ITALIC, color=H["INK"])
        detail_gone.next_to(collapsed, DOWN, buff=0.5)
        self.play(FadeIn(detail_gone), run_time=0.5)

        right_rows = VGroup(*[Text(t, font=SANS, font_size=24, color=H["INK"]) for t in tracks])
        right_rows.arrange(DOWN, buff=0.4).move_to([3.2, 1.2, 0])
        self.play(Write(right_rows), run_time=0.8)

        bracket = Brace(right_rows, direction=LEFT, color=H["SLATE"])
        part_label = Text("PARTITION BY user_id", font=MONO, font_size=18, color=H["SLATE"])
        part_label.next_to(bracket, LEFT, buff=0.2)
        self.play(FadeIn(bracket), FadeIn(part_label), run_time=0.6)

        order_arrow = Arrow(right_rows.get_top() + UP * 0.2, right_rows.get_bottom() + DOWN * 0.2, color=H["TEAL"], buff=0)
        order_arrow.next_to(right_rows, RIGHT, buff=0.5)
        order_label = Text("ORDER BY plays DESC", font=MONO, font_size=18, color=H["TEAL"])
        order_label.next_to(order_arrow, RIGHT, buff=0.2)
        self.play(Create(order_arrow), FadeIn(order_label), run_time=0.7)

        cap = caption("Collapses vs. preserves.")
        self.play(FadeIn(cap), run_time=0.5)
        self.wait(1.3)


def result_row(uid, track, plays, y, flag_color=H["TEAL"]):
    txt = Text(f"user {uid}  ·  {track}  ·  {plays} plays", font=MONO, font_size=26, color=H["INK"])
    txt.move_to([-1.0, y, 0])
    mark = Text("OK" if flag_color == H["TEAL"] else "!", font=SANS, font_size=26, color=flag_color, weight="BOLD")
    mark.next_to(txt, RIGHT, buff=0.6)
    return VGroup(txt, mark)


class B05_TopTrackBuggyOutput(Scene):
    def construct(self):
        self.camera.background_color = H["INK"]
        ticker = Text("rows returned: 0 / users: 3", font=MONO, font_size=24, color=H["CREAM"]).to_edge(UP, buff=0.6)
        self.play(FadeIn(ticker), run_time=0.4)

        r1 = result_row(102, "T-ECHO", 7, 1.6, H["TEAL"])
        self.play(FadeIn(r1, shift=UP * 0.2), run_time=0.5)
        ticker2 = Text("rows returned: 1 / users: 3", font=MONO, font_size=24, color=H["CREAM"]).to_edge(UP, buff=0.6)
        self.play(Transform(ticker, ticker2), run_time=0.3)

        r2 = result_row(103, "T-DRIFT", 6, 0.8, H["TEAL"])
        self.play(FadeIn(r2, shift=UP * 0.2), run_time=0.5)
        ticker3 = Text("rows returned: 2 / users: 3", font=MONO, font_size=24, color=H["CREAM"]).to_edge(UP, buff=0.6)
        self.play(Transform(ticker, ticker3), run_time=0.3)

        r3a = result_row(101, "T-ECHO", 5, 0.0, H["CRIMSON"])
        r3b = result_row(101, "T-NOVA", 5, -0.7, H["CRIMSON"])
        self.play(FadeIn(r3a, shift=UP * 0.2), FadeIn(r3b, shift=UP * 0.2), run_time=0.6)

        badge = Text("2 ROWS FOR ONE USER", font=SANS, font_size=24, color="#FFFFFF", weight="BOLD")
        badge_bg = RoundedRectangle(corner_radius=0.12, width=badge.width + 0.6, height=0.7, color=H["CRIMSON"], fill_color=H["CRIMSON"], fill_opacity=1)
        badge_bg.move_to([2.6, -0.35, 0])
        badge.move_to(badge_bg.get_center())
        self.play(FadeIn(badge_bg), FadeIn(badge), run_time=0.5)
        self.play(badge_bg.animate.set_fill(opacity=0.6), run_time=0.3)
        self.play(badge_bg.animate.set_fill(opacity=1.0), run_time=0.3)

        ticker4 = Text("rows returned: 4 / users: 3", font=MONO, font_size=24, color=H["CRIMSON"], weight="BOLD").to_edge(UP, buff=0.6)
        self.play(Transform(ticker, ticker4), run_time=0.4)
        self.wait(1.2)


class B08_TopTrackFixedOutput(Scene):
    def construct(self):
        self.camera.background_color = H["INK"]
        ticker = Text("rows returned: 0 / users: 3", font=MONO, font_size=24, color=H["CREAM"]).to_edge(UP, buff=0.6)
        self.play(FadeIn(ticker), run_time=0.4)

        r1 = result_row(102, "T-ECHO", 7, 1.6, H["TEAL"])
        r2 = result_row(103, "T-DRIFT", 6, 0.8, H["TEAL"])
        self.play(FadeIn(r1, shift=UP * 0.2), run_time=0.5)
        self.play(FadeIn(r2, shift=UP * 0.2), run_time=0.5)
        ticker2 = Text("rows returned: 2 / users: 3", font=MONO, font_size=24, color=H["CREAM"]).to_edge(UP, buff=0.6)
        self.play(Transform(ticker, ticker2), run_time=0.3)

        ghost = result_row(101, "T-NOVA", 5, 0.0, H["CRIMSON"])
        self.play(FadeIn(ghost, shift=UP * 0.2), run_time=0.4)
        strike = Line(ghost.get_left(), ghost.get_right(), color=H["CRIMSON"], stroke_width=3)
        self.play(Create(strike), run_time=0.3)
        self.play(FadeOut(ghost), FadeOut(strike), run_time=0.4)

        r3 = result_row(101, "T-ECHO", 5, 0.0, H["TEAL"])
        self.play(FadeIn(r3, shift=UP * 0.2), run_time=0.5)

        ticker3 = Text("rows returned: 3 / users: 3", font=MONO, font_size=24, color=H["TEAL"], weight="BOLD").to_edge(UP, buff=0.6)
        self.play(Transform(ticker, ticker3), run_time=0.4)
        self.wait(1.3)


class B09_Lesson(Scene):
    def construct(self):
        self.camera.background_color = H["CREAM"]
        lines = [
            "Read the output.",
            "Count the rows.",
            "Check the case the happy path skips.",
        ]
        items = VGroup()
        y = 1.6
        for l in lines:
            t = Text(l, font=SERIF, font_size=32, color=H["INK"], weight="BOLD").move_to([-0.5, y, 0], aligned_edge=LEFT)
            check = Text("✓", font=SANS, font_size=30, color=H["TEAL"], weight="BOLD").next_to(t, LEFT, buff=0.4)
            items.add(VGroup(check, t))
            y -= 0.9
        for it in items:
            self.play(Write(it), run_time=0.7)

        note = Text(
            "Ch.7: AI output can pass a surface smell test and still be subtly wrong.",
            font=SERIF, font_size=22, slant=ITALIC, color=H["SLATE"],
        ).move_to([0, -1.9, 0])
        self.play(FadeIn(note), run_time=0.6)
        self.wait(1.3)
