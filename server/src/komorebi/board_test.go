package komorebi

import (
	"fmt"
	"io/ioutil"
	"os"
	"testing"
)

func TestMain(m *testing.M) {
	file, _ := ioutil.TempFile(os.TempDir(), "komorebi")
	db := InitDb(file.Name())
	db.AddTable(Board{}, "boards")
	db.AddTable(Column{}, "columns")
	db.CreateTables()
	fmt.Println("created db " + file.Name())

	//Fixtures
	b := NewBoard("test1")
	b.Save()
	c1 := NewColumn("WIP", 0, b.Id)
	c2 := NewColumn("TEST", 1, b.Id)
	c1.Save()
	c2.Save()

	res := m.Run()

	err := os.Remove(file.Name())
	if err != nil {
		fmt.Println("Error while removing file:", err)
	} else {
		fmt.Println("removed file:", file.Name())
	}

	os.Exit(res)
}

func TestNewBoard(t *testing.T) {
	b := NewBoard("test")
	if b.Name != "test" {
		t.Error("Board should have name test")
	}
	if !b.Save() {
		t.Error("Should save a board")
	}

	boards := GetAllBoards()
	b = boards[1]
	if b.Name != "test" {
		t.Error("Board should have name test", b.Name)
	}
	if b.Id != 2 {
		t.Error("Should return 2 board:", b.Id)
	}

	c1 := NewColumn("WIP", 0, b.Id)
	c2 := NewColumn("TEST", 1, b.Id)
	c1.Save()
	c2.Save()

	boardView := GetBoardColumnViewByName(b.Name)
	if boardView.Name != "test" {
		t.Error("Should retrive a BoardColumnView:", boardView.Name)
	}
	if len(boardView.Columns) <= 0 {
		t.Error("Could not find any boardViews columns")
	}
	bcv1 := boardView.Columns[0]
	if bcv1.Name != "WIP" {
		t.Error("Should retrive columns with BoardColumnView")
	}
}

func TestBoardValidation(t *testing.T) {
	b := NewBoard("testValidation")
	if success, _ := b.Validate(); success == false {
		t.Error("Name 'testValidation' should be valid")
	}

	b = NewBoard("test foo")
	if success, _ := b.Validate(); success == true {
		t.Error("Name 'test foo' should not be valid")
	}

	b = NewBoard("gz")
	b.Save()

	b = NewBoard("gz")
	if success, _ := b.Validate(); success == true {
		t.Error("Name 'gz' should be uniq")
	}
}
