'use strict';

const HASH = '$2b$10$' + 'x'.repeat(53); // fictitious, exactly 60 chars

module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;
    const id = async (sql, replacements) => {
      const [rows] = await db.query(sql, { replacements });
      return rows[0].id;
    };

    // 1. users (6): 1 host, 4 players, 1 account that never joins (awkward case)
    await queryInterface.bulkInsert('users', [
      { school_id: '2099-0001', username: 'host_demo',  email: 'host.demo@bookduel.test',  password_hash: HASH, role: 'host',   full_name: 'Demo Host' },
      { school_id: '2099-1001', username: 'player_one', email: 'player.one@bookduel.test', password_hash: HASH, role: 'player', full_name: 'Player One' },
      { school_id: '2099-1002', username: 'player_two', email: 'player.two@bookduel.test', password_hash: HASH, role: 'player', full_name: 'Player Two' },
      { school_id: '2099-1003', username: 'player_three', email: 'player.three@bookduel.test', password_hash: HASH, role: 'player', full_name: 'Player Three' },
      { school_id: '2099-1004', username: 'player_four', email: 'player.four@bookduel.test', password_hash: HASH, role: 'player', full_name: 'Player Four' },
      { school_id: '2099-1005', username: 'never_joined', email: 'never.joined@bookduel.test', password_hash: HASH, role: 'player', full_name: 'Never Joined' },
    ]);
    const userId = (sid) => id('SELECT user_id AS id FROM users WHERE school_id = :sid', { sid });
    const hostId = await userId('2099-0001');

    // 2. question set, questions, choices
    await queryInterface.bulkInsert('question_sets', [
      { host_id: hostId, title: 'Demo Literature Set', description: 'Fictitious demo set', subject: 'Literature', grade_level: 'College' },
    ]);
    const setId = await id('SELECT question_set_id AS id FROM question_sets WHERE title = :t', { t: 'Demo Literature Set' });

    await queryInterface.bulkInsert('questions', [
      { question_set_id: setId, text: 'Who wrote Noli Me Tangere?',  type: 'multiple_choice', time_limit_sec: 20, position: 1 },
      { question_set_id: setId, text: 'Who wrote El Filibusterismo?', type: 'multiple_choice', time_limit_sec: 20, position: 2 },
    ]);
    const qId = (pos) => id('SELECT question_id AS id FROM questions WHERE question_set_id = :s AND position = :p', { s: setId, p: pos });
    const q1 = await qId(1);
    const q2 = await qId(2);

    await queryInterface.bulkInsert('choices', [
      { question_id: q1, text: 'Jose Rizal',    position: 0, is_correct: true },
      { question_id: q1, text: 'Andres Bonifacio', position: 1, is_correct: false },
      { question_id: q1, text: 'Emilio Aguinaldo', position: 2, is_correct: false },
      { question_id: q2, text: 'Jose Rizal',    position: 0, is_correct: true },
      { question_id: q2, text: 'Apolinario Mabini', position: 1, is_correct: false },
      { question_id: q2, text: 'Marcelo del Pilar', position: 2, is_correct: false },
    ]);
    const choiceId = (q, pos) => id('SELECT choice_id AS id FROM choices WHERE question_id = :q AND position = :p', { q, p: pos });

    // 3. one ended game
    await queryInterface.bulkInsert('sessions', [{
      host_id: hostId, question_set_id: setId, join_code: '482613',
      status: 'ended', end_reason: 'questions_ran_out',
      started_at: new Date('2026-10-09T01:00:00Z'), ended_at: new Date('2026-10-09T01:05:00Z'),
    }]);
    const sessionId = await id('SELECT session_id AS id FROM sessions WHERE join_code = :c', { c: '482613' });

    // 4. seats: P1 5hp/200, P2 4hp/100, P3 4hp/100 (tie), P4 3hp/0 (did not complete)
    const seats = [
      { sid: '2099-1001', nickname: 'Rina', hp: 5, score: 200, is_winner: true },
      { sid: '2099-1002', nickname: 'Dale', hp: 4, score: 100, is_winner: false },
      { sid: '2099-1003', nickname: 'Pao',  hp: 4, score: 100, is_winner: false },
      { sid: '2099-1004', nickname: 'Lia',  hp: 3, score: 0,   is_winner: false },
    ];
    for (const s of seats) {
      await queryInterface.bulkInsert('session_players', [{
        session_id: sessionId, user_id: await userId(s.sid), nickname: s.nickname,
        hp: s.hp, score: s.score, is_eliminated: false, is_winner: s.is_winner,
      }]);
    }
    const playerId = (nickname) => id('SELECT session_player_id AS id FROM session_players WHERE session_id = :s AND nickname = :n', { s: sessionId, n: nickname });

    // 5. rounds (closed)
    await queryInterface.bulkInsert('rounds', [
      { session_id: sessionId, question_id: q1, round_no: 1, status: 'closed', is_voided: false,
        started_at: new Date('2026-10-09T01:01:00Z'), deadline_at: new Date('2026-10-09T01:01:20Z'), closed_at: new Date('2026-10-09T01:01:20Z') },
      { session_id: sessionId, question_id: q2, round_no: 2, status: 'closed', is_voided: false,
        started_at: new Date('2026-10-09T01:03:00Z'), deadline_at: new Date('2026-10-09T01:03:20Z'), closed_at: new Date('2026-10-09T01:03:20Z') },
    ]);
    const roundId = (no) => id('SELECT round_id AS id FROM rounds WHERE session_id = :s AND round_no = :n', { s: sessionId, n: no });
    const r1 = await roundId(1);
    const r2 = await roundId(2);

    // 6. answers: [round, nickname, question, picked position or null, correct]
    const plan = [
      [r1, 'Rina', q1, 0, true],  [r2, 'Rina', q2, 0, true],
      [r1, 'Dale', q1, 0, true],  [r2, 'Dale', q2, 1, false],
      [r1, 'Pao',  q1, 1, false], [r2, 'Pao',  q2, 0, true],
      [r1, 'Lia',  q1, 1, false], [r2, 'Lia',  q2, null, false], // no answer
    ];
    for (const [r, nick, q, pos, ok] of plan) {
      const answered = pos !== null;
      await queryInterface.bulkInsert('answers', [{
        round_id: r,
        session_player_id: await playerId(nick),
        choice_id: answered ? await choiceId(q, pos) : null,
        is_correct: ok,
        damage_taken: ok ? 0 : 1,
        score_earned: ok ? 100 : 0,
        answered_at: answered ? new Date('2026-10-09T01:01:10Z') : null,
      }]);
    }
  },

  async down(queryInterface) {
    const db = queryInterface.sequelize;
    // sessions first (cascades seats, rounds, answers), then sets, then users
    await db.query("DELETE FROM sessions WHERE join_code = '482613'");
    await db.query("DELETE FROM question_sets WHERE title = 'Demo Literature Set'");
    await db.query("DELETE FROM users WHERE school_id LIKE '2099-%'");
  },
};